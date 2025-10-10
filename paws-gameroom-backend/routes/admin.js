const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const { generateToken, verifyToken, isAdmin } = require('../middleware/auth');

// Paths to data files
const DATA_DIR = path.join(__dirname, '..', 'data');
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const GAMES_FILE = path.join(DATA_DIR, 'games.json');
const TOURNAMENTS_FILE = path.join(DATA_DIR, 'tournaments.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Ensure data directory and files exist
fs.ensureDirSync(DATA_DIR);
fs.ensureDirSync(UPLOADS_DIR);

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.'
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = UPLOADS_DIR;
    if (req.body.category) {
      uploadPath = path.join(UPLOADS_DIR, req.body.category);
      fs.ensureDirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Helper functions
const readJsonFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};

const writeJsonFile = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// ==================== AUTH ROUTES ====================

// Login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Missing credentials',
        message: 'Username and password are required' 
      });
    }
    
    const usersData = await readJsonFile(USERS_FILE) || { users: [] };
    const user = usersData.users.find(u => u.username === username);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Invalid username or password' 
      });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Invalid username or password' 
      });
    }
    
    const token = generateToken(user);
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      message: error.message 
    });
  }
});

// Verify token
router.get('/verify', verifyToken, (req, res) => {
  res.json({ 
    success: true,
    user: req.user 
  });
});

// Create initial admin user (only works if no users exist)
router.post('/setup', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Missing fields',
        message: 'Username and password are required' 
      });
    }
    
    const usersData = await readJsonFile(USERS_FILE) || { users: [] };
    
    if (usersData.users.length > 0) {
      return res.status(403).json({ 
        error: 'Setup already complete',
        message: 'Admin user already exists' 
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: 1,
      username,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    
    usersData.users.push(newUser);
    await writeJsonFile(USERS_FILE, usersData);
    
    res.json({ 
      success: true,
      message: 'Admin user created successfully' 
    });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ 
      error: 'Setup failed',
      message: error.message 
    });
  }
});

// ==================== CONTENT MANAGEMENT ====================

// Get content
router.get('/content/:page?', verifyToken, isAdmin, async (req, res) => {
  try {
    const content = await readJsonFile(CONTENT_FILE) || {};
    
    if (req.params.page) {
      res.json(content[req.params.page] || {});
    } else {
      res.json(content);
    }
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch content',
      message: error.message 
    });
  }
});

// Update content
router.post('/content/:page', verifyToken, isAdmin, async (req, res) => {
  try {
    const content = await readJsonFile(CONTENT_FILE) || {};
    content[req.params.page] = req.body;
    await writeJsonFile(CONTENT_FILE, content);
    
    res.json({ 
      success: true,
      message: 'Content updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to update content',
      message: error.message 
    });
  }
});

// ==================== GAMES MANAGEMENT ====================

// Get all games
router.get('/games', verifyToken, isAdmin, async (req, res) => {
  try {
    const gamesData = await readJsonFile(GAMES_FILE) || { games: [] };
    res.json(gamesData.games);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch games',
      message: error.message 
    });
  }
});

// Add new game
router.post('/games', verifyToken, isAdmin, async (req, res) => {
  try {
    const gamesData = await readJsonFile(GAMES_FILE) || { games: [] };
    
    const newGame = {
      id: Date.now(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    gamesData.games.push(newGame);
    await writeJsonFile(GAMES_FILE, gamesData);
    
    res.json({ 
      success: true,
      game: newGame 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to add game',
      message: error.message 
    });
  }
});

// Update game
router.put('/games/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const gamesData = await readJsonFile(GAMES_FILE) || { games: [] };
    const gameIndex = gamesData.games.findIndex(g => g.id === parseInt(req.params.id));
    
    if (gameIndex === -1) {
      return res.status(404).json({ 
        error: 'Game not found' 
      });
    }
    
    gamesData.games[gameIndex] = {
      ...gamesData.games[gameIndex],
      ...req.body,
      id: gamesData.games[gameIndex].id,
      updatedAt: new Date().toISOString()
    };
    
    await writeJsonFile(GAMES_FILE, gamesData);
    
    res.json({ 
      success: true,
      game: gamesData.games[gameIndex] 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to update game',
      message: error.message 
    });
  }
});

// Delete game
router.delete('/games/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const gamesData = await readJsonFile(GAMES_FILE) || { games: [] };
    gamesData.games = gamesData.games.filter(g => g.id !== parseInt(req.params.id));
    
    await writeJsonFile(GAMES_FILE, gamesData);
    
    res.json({ 
      success: true,
      message: 'Game deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to delete game',
      message: error.message 
    });
  }
});

// ==================== TOURNAMENTS MANAGEMENT ====================

// Get all tournaments (admin view with registrations)
router.get('/tournaments', verifyToken, isAdmin, async (req, res) => {
  try {
    const tournamentsData = await readJsonFile(TOURNAMENTS_FILE) || { tournaments: [], registrations: [] };
    res.json(tournamentsData);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch tournaments',
      message: error.message 
    });
  }
});

// Create tournament
router.post('/tournaments', verifyToken, isAdmin, async (req, res) => {
  try {
    const tournamentsData = await readJsonFile(TOURNAMENTS_FILE) || { tournaments: [], registrations: [] };
    
    const newTournament = {
      id: Date.now(),
      ...req.body,
      currentPlayers: 0,
      createdAt: new Date().toISOString()
    };
    
    tournamentsData.tournaments.push(newTournament);
    await writeJsonFile(TOURNAMENTS_FILE, tournamentsData);
    
    res.json({ 
      success: true,
      tournament: newTournament 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to create tournament',
      message: error.message 
    });
  }
});

// Update tournament
router.put('/tournaments/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const tournamentsData = await readJsonFile(TOURNAMENTS_FILE) || { tournaments: [], registrations: [] };
    const tournamentIndex = tournamentsData.tournaments.findIndex(t => t.id === parseInt(req.params.id));
    
    if (tournamentIndex === -1) {
      return res.status(404).json({ 
        error: 'Tournament not found' 
      });
    }
    
    tournamentsData.tournaments[tournamentIndex] = {
      ...tournamentsData.tournaments[tournamentIndex],
      ...req.body,
      id: tournamentsData.tournaments[tournamentIndex].id,
      updatedAt: new Date().toISOString()
    };
    
    await writeJsonFile(TOURNAMENTS_FILE, tournamentsData);
    
    res.json({ 
      success: true,
      tournament: tournamentsData.tournaments[tournamentIndex] 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to update tournament',
      message: error.message 
    });
  }
});

// Delete tournament
router.delete('/tournaments/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const tournamentsData = await readJsonFile(TOURNAMENTS_FILE) || { tournaments: [], registrations: [] };
    
    // Remove tournament
    tournamentsData.tournaments = tournamentsData.tournaments.filter(t => t.id !== parseInt(req.params.id));
    
    // Remove associated registrations
    tournamentsData.registrations = tournamentsData.registrations.filter(r => r.tournamentId !== parseInt(req.params.id));
    
    await writeJsonFile(TOURNAMENTS_FILE, tournamentsData);
    
    res.json({ 
      success: true,
      message: 'Tournament deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to delete tournament',
      message: error.message 
    });
  }
});

// ==================== IMAGE UPLOAD ====================

// Upload image
router.post('/upload', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded' 
      });
    }
    
    const fileUrl = `/uploads/${req.body.category || 'site'}/${req.file.filename}`;
    
    res.json({ 
      success: true,
      url: fileUrl,
      filename: req.file.filename 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Upload failed',
      message: error.message 
    });
  }
});

// Delete image
router.delete('/upload/:category/:filename', verifyToken, isAdmin, async (req, res) => {
  try {
    const filePath = path.join(UPLOADS_DIR, req.params.category, req.params.filename);
    
    if (await fs.pathExists(filePath)) {
      await fs.unlink(filePath);
      res.json({ 
        success: true,
        message: 'Image deleted successfully' 
      });
    } else {
      res.status(404).json({ 
        error: 'File not found' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to delete image',
      message: error.message 
    });
  }
});

// ==================== SETTINGS ====================

// Get settings
router.get('/settings', verifyToken, isAdmin, async (req, res) => {
  try {
    const settings = await readJsonFile(SETTINGS_FILE) || {};
    res.json(settings);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch settings',
      message: error.message 
    });
  }
});

// Update settings
router.post('/settings', verifyToken, isAdmin, async (req, res) => {
  try {
    await writeJsonFile(SETTINGS_FILE, req.body);
    res.json({ 
      success: true,
      message: 'Settings updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to update settings',
      message: error.message 
    });
  }
});

module.exports = router;