const express = require('express');
const router = express.Router();
const igdbService = require('../services/igdb');
const bggService = require('../services/bgg');

// Get all gameroom games
router.get('/games', async (req, res) => {
  try {
    // Fetch video games from IGDB
    const videoGames = await igdbService.getGameroomGames();
    
    // Fetch board games from BGG
    const boardGames = await bggService.fetchBoardGames();
    
    // Combine the results
    const allGames = {
      ...videoGames,
      boardgames: boardGames
    };
    
    res.json(allGames);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ 
      error: 'Failed to fetch games',
      message: error.message 
    });
  }
});

// Search for games
router.get('/games/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { platform } = req.query;
    
    const games = await igdbService.searchGames(query, platform);
    res.json(games);
  } catch (error) {
    console.error('Error searching games:', error);
    res.status(500).json({ 
      error: 'Failed to search games',
      message: error.message 
    });
  }
});

// Get games by platform
router.get('/games/platform/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const allGames = await igdbService.getGameroomGames();
    
    if (allGames[platform]) {
      res.json(allGames[platform]);
    } else {
      res.status(404).json({ error: 'Platform not found' });
    }
  } catch (error) {
    console.error('Error fetching platform games:', error);
    res.status(500).json({ 
      error: 'Failed to fetch platform games',
      message: error.message 
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'IGDB Game Service',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;