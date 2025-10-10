const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const gamesRoutes = require('./routes/games');
const tournamentsRoutes = require('./routes/tournaments');
const adminRoutes = require('./routes/admin');

app.use('/api', gamesRoutes);
app.use('/api', tournamentsRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Paws Gameroom Backend API',
    endpoints: {
      games: '/api/games',
      search: '/api/games/search/:query',
      platform: '/api/games/platform/:platform',
      tournaments: '/api/tournaments',
      tournamentDetails: '/api/tournaments/:id',
      tournamentRegister: '/api/tournaments/:id/register',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('IGDB Integration: ', process.env.IGDB_CLIENT_ID ? 'Enabled' : 'Disabled');
});