const axios = require('axios');
const xml2js = require('xml2js');
const NodeCache = require('node-cache');

// Cache BGG responses for 5 minutes
const cache = new NodeCache({ stdTTL: 300 });

// Popular board game IDs on BGG
const BOARD_GAME_IDS = [
  13,     // Catan (Settlers of Catan)
  9209,   // Ticket to Ride
  1406,   // Monopoly  
  161936, // Pandemic
  320,    // Scrabble
  181,    // Risk
  1294,   // Clue/Cluedo
  124361, // Codenames
  171,    // Chess
  2083,   // Checkers
  2223,   // UNO
  54200,  // Jenga
  68448,  // 7 Wonders
  167355, // Azul
  173346  // Wingspan
];

const parser = new xml2js.Parser({ explicitArray: false });

async function fetchBoardGames() {
  try {
    // Check cache first
    const cached = cache.get('boardgames');
    if (cached) {
      console.log('Returning cached board games data');
      return cached;
    }

    console.log('Fetching board games from BGG API...');
    
    // Fetch multiple games at once using the BGG API
    const idsString = BOARD_GAME_IDS.join(',');
    const response = await axios.get(
      `https://boardgamegeek.com/xmlapi2/thing?id=${idsString}&type=boardgame&stats=1`,
      {
        headers: {
          'User-Agent': 'PawsPlayGameroom/1.0',
          'Accept': 'application/xml'
        },
        timeout: 10000
      }
    );

    // Parse XML response
    const result = await parser.parseStringPromise(response.data);
    const items = result.items.item;
    const gamesArray = Array.isArray(items) ? items : [items];

    // Transform BGG data to match our format
    const transformedGames = gamesArray.map((game, index) => {
      // Extract primary name
      const nameObj = Array.isArray(game.name) 
        ? game.name.find(n => n.$.type === 'primary') || game.name[0]
        : game.name;
      
      const title = nameObj.$.value || 'Unknown Game';
      
      // Get game details
      const minPlayers = game.minplayers?.$.value || '2';
      const maxPlayers = game.maxplayers?.$.value || '4';
      const playingTime = game.playingtime?.$.value || '60';
      const minAge = game.minage?.$.value || '8';
      
      // Get description
      const description = game.description || 'A classic board game for friends and family.';
      const cleanDescription = description.replace(/&#10;/g, ' ')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .substring(0, 200) + '...';
      
      // Get image
      const imageUrl = game.image || game.thumbnail || 
        `https://via.placeholder.com/300x400/667eea/ffffff?text=${encodeURIComponent(title)}`;
      
      // Get BGG link for rules
      const bggId = game.$.id;
      const rulesUrl = `https://boardgamegeek.com/boardgame/${bggId}`;
      
      // Determine genre based on mechanics/categories
      let genre = 'Strategy';
      if (game.boardgamecategory) {
        const categories = Array.isArray(game.boardgamecategory) 
          ? game.boardgamecategory.map(c => c.$.value)
          : [game.boardgamecategory.$.value];
        
        if (categories.some(c => c.includes('Party'))) genre = 'Party';
        else if (categories.some(c => c.includes('Word'))) genre = 'Word Game';
        else if (categories.some(c => c.includes('Deduction'))) genre = 'Deduction';
        else if (categories.some(c => c.includes('Economic'))) genre = 'Economic';
        else if (categories.some(c => c.includes('Cooperative'))) genre = 'Cooperative';
        else if (categories.some(c => c.includes('Dexterity'))) genre = 'Dexterity';
      }
      
      return {
        id: `board-${bggId}`,
        title: title,
        genre: genre,
        players: `${minPlayers}-${maxPlayers} Players`,
        rating: `${minAge}+`,
        playtime: `${playingTime} minutes`,
        description: cleanDescription,
        image: imageUrl,
        rules: rulesUrl
      };
    });

    // Cache the results
    cache.set('boardgames', transformedGames);
    
    return transformedGames;
  } catch (error) {
    console.error('Error fetching board games from BGG:', error.message);
    
    // Return fallback board games if API fails
    return [
      {
        id: 'board-1',
        title: 'Settlers of Catan',
        genre: 'Strategy',
        players: '3-4 Players',
        rating: '10+',
        playtime: '60-90 minutes',
        description: 'Build settlements, cities, and roads on the island of Catan as you trade resources and compete for victory.',
        image: 'https://m.media-amazon.com/images/I/81+okm4IpfL._AC_SL1500_.jpg',
        rules: 'https://boardgamegeek.com/boardgame/13/catan'
      },
      {
        id: 'board-2',
        title: 'Ticket to Ride',
        genre: 'Strategy',
        players: '2-5 Players',
        rating: '8+',
        playtime: '30-60 minutes',
        description: 'Collect cards of various types of train cars and claim railway routes connecting cities throughout North America.',
        image: 'https://m.media-amazon.com/images/I/91YNJM4oyhL._AC_SL1500_.jpg',
        rules: 'https://boardgamegeek.com/boardgame/9209/ticket-ride'
      },
      {
        id: 'board-3',
        title: 'Pandemic',
        genre: 'Cooperative',
        players: '2-4 Players',
        rating: '8+',
        playtime: '45 minutes',
        description: 'Work together as a team to treat infections around the world while gathering resources for cures.',
        image: 'https://m.media-amazon.com/images/I/71CVlZKm9BL._AC_SL1024_.jpg',
        rules: 'https://boardgamegeek.com/boardgame/161936/pandemic'
      }
    ];
  }
}

module.exports = {
  fetchBoardGames
};