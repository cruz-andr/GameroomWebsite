const express = require('express');
const router = express.Router();

// In-memory storage for tournaments and registrations (in production, use a database)
let tournaments = [
  {
    id: 1,
    name: "Mario Kart 8 Championship",
    game: "Mario Kart 8 Deluxe",
    date: "2024-11-15",
    time: "7:00 PM",
    maxPlayers: 32,
    currentPlayers: 18,
    format: "Double Elimination",
    description: "Battle it out in our monthly Mario Kart tournament! Prizes for top 3 finishers.",
    image: "🏁"
  },
  {
    id: 2,
    name: "Super Smash Bros Ultimate Showdown",
    game: "Super Smash Bros Ultimate",
    date: "2024-11-22",
    time: "6:30 PM",
    maxPlayers: 24,
    currentPlayers: 12,
    format: "Swiss Rounds",
    description: "Test your skills in this competitive Smash tournament. All skill levels welcome!",
    image: "⚔️"
  },
  {
    id: 3,
    name: "FIFA 24 Cup",
    game: "FIFA 24",
    date: "2024-11-29",
    time: "5:00 PM",
    maxPlayers: 16,
    currentPlayers: 8,
    format: "Single Elimination",
    description: "Show off your soccer skills in our FIFA tournament. Champion gets their name on our trophy!",
    image: "⚽"
  },
  {
    id: 4,
    name: "Tekken 8 Fight Night",
    game: "Tekken 8",
    date: "2024-12-06",
    time: "7:30 PM",
    maxPlayers: 20,
    currentPlayers: 5,
    format: "Round Robin",
    description: "Join us for an intense night of fighting game action. Beginners encouraged to join!",
    image: "🥊"
  }
];

let registrations = [];

// Get all tournaments
router.get('/tournaments', (req, res) => {
  try {
    res.json(tournaments);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    res.status(500).json({ 
      error: 'Failed to fetch tournaments',
      message: error.message 
    });
  }
});

// Get a specific tournament
router.get('/tournaments/:id', (req, res) => {
  try {
    const tournament = tournaments.find(t => t.id === parseInt(req.params.id));
    
    if (!tournament) {
      return res.status(404).json({ 
        error: 'Tournament not found' 
      });
    }
    
    res.json(tournament);
  } catch (error) {
    console.error('Error fetching tournament:', error);
    res.status(500).json({ 
      error: 'Failed to fetch tournament',
      message: error.message 
    });
  }
});

// Register for a tournament
router.post('/tournaments/:id/register', (req, res) => {
  try {
    const tournamentId = parseInt(req.params.id);
    const tournament = tournaments.find(t => t.id === tournamentId);
    
    if (!tournament) {
      return res.status(404).json({ 
        error: 'Tournament not found' 
      });
    }
    
    // Check if tournament is full
    if (tournament.currentPlayers >= tournament.maxPlayers) {
      return res.status(400).json({ 
        error: 'Tournament is full',
        message: 'This tournament has reached maximum capacity' 
      });
    }
    
    const { name, nuid, email, studentType, tournamentName } = req.body;
    
    // Validate required fields
    if (!name || !nuid || !email || !studentType) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Please provide all required information' 
      });
    }
    
    // Check if already registered (by NUID)
    const existingRegistration = registrations.find(
      r => r.nuid === nuid && r.tournamentId === tournamentId
    );
    
    if (existingRegistration) {
      return res.status(400).json({ 
        error: 'Already registered',
        message: 'You are already registered for this tournament' 
      });
    }
    
    // Create new registration
    const registration = {
      id: registrations.length + 1,
      tournamentId,
      tournamentName: tournament.name,
      name,
      nuid,
      email,
      studentType,
      registeredAt: new Date().toISOString()
    };
    
    registrations.push(registration);
    
    // Update tournament player count
    tournament.currentPlayers++;
    
    // Log registration for monitoring
    console.log('New tournament registration:', {
      tournamentId,
      tournamentName: tournament.name,
      studentName: name,
      studentType
    });
    
    res.status(201).json({
      success: true,
      message: 'Successfully registered for tournament',
      registration: {
        id: registration.id,
        tournamentName: tournament.name,
        date: tournament.date,
        time: tournament.time
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed',
      message: error.message 
    });
  }
});

// Get all registrations for a tournament (admin endpoint)
router.get('/tournaments/:id/registrations', (req, res) => {
  try {
    const tournamentId = parseInt(req.params.id);
    const tournamentRegistrations = registrations.filter(
      r => r.tournamentId === tournamentId
    );
    
    res.json({
      tournamentId,
      totalRegistrations: tournamentRegistrations.length,
      registrations: tournamentRegistrations
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ 
      error: 'Failed to fetch registrations',
      message: error.message 
    });
  }
});

// Get all registrations (admin endpoint)
router.get('/registrations', (req, res) => {
  try {
    res.json({
      totalRegistrations: registrations.length,
      registrations
    });
  } catch (error) {
    console.error('Error fetching all registrations:', error);
    res.status(500).json({ 
      error: 'Failed to fetch registrations',
      message: error.message 
    });
  }
});

module.exports = router;