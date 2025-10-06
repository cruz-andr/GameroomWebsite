// Vercel Serverless Function for Games API
const axios = require('axios');

// IGDB Configuration
const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;

// BGG Configuration
const BGG_BASE_URL = 'https://boardgamegeek.com/xmlapi2';

// Cache for access token
let accessToken = null;
let tokenExpiry = null;

// Get IGDB Access Token
async function getIGDBAccessToken() {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: IGDB_CLIENT_ID,
        client_secret: IGDB_CLIENT_SECRET,
        grant_type: 'client_credentials'
      }
    });

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000);
    return accessToken;
  } catch (error) {
    console.error('Failed to get IGDB access token:', error);
    return null;
  }
}

// Fetch video games from IGDB
async function fetchVideoGames() {
  const token = await getIGDBAccessToken();
  if (!token) return { ps5: [], xbox: [], switch: [] };

  const gameIds = {
    ps5: [1905, 11198, 119171, 119277, 138669, 214397, 256092],
    xbox: [120, 1879, 1905, 1942, 3225, 11198, 111469, 120619, 125165, 125174, 125624, 135400, 194682, 204623, 214397, 256092, 308034, 325608],
    switch: [7346, 18229, 26758, 76073, 116530, 146493]
  };

  const results = { ps5: [], xbox: [], switch: [] };

  for (const [platform, ids] of Object.entries(gameIds)) {
    try {
      const response = await axios.post(
        'https://api.igdb.com/v4/games',
        `fields name,cover.image_id,genres.name,platforms.name,summary,age_ratings.rating,rating,first_release_date;
         where id = (${ids.join(',')});
         limit 50;`,
        {
          headers: {
            'Client-ID': IGDB_CLIENT_ID,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'text/plain'
          }
        }
      );

      results[platform] = response.data.map(game => ({
        id: game.id,
        title: game.name,
        image: game.cover?.image_id 
          ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
          : 'https://via.placeholder.com/264x374?text=No+Cover',
        genre: game.genres?.map(g => g.name).join(', ') || 'Unknown',
        platforms: game.platforms?.map(p => p.name).join(', ') || 'Unknown',
        description: game.summary || 'No description available.',
        rating: 'Not Rated',
        score: game.rating ? Math.round(game.rating) : null,
        releaseDate: game.first_release_date 
          ? new Date(game.first_release_date * 1000).getFullYear()
          : null
      }));
    } catch (error) {
      console.error(`Error fetching ${platform} games:`, error);
    }
  }

  return results;
}

// Fetch board games from BGG
async function fetchBoardGames() {
  const boardGameIds = [13, 9209, 1406, 161936, 320, 181, 1294, 124361, 171, 2083, 2223, 68448];
  const games = [];

  for (const id of boardGameIds) {
    try {
      const response = await axios.get(`${BGG_BASE_URL}/thing`, {
        params: {
          id: id,
          stats: 1
        }
      });

      const parser = new (require('xml2js')).Parser();
      const result = await parser.parseStringPromise(response.data);
      const item = result.items.item[0];

      games.push({
        id: `board-${id}`,
        title: item.name[0].$.value,
        genre: 'Strategy',
        players: `${item.minplayers[0].$.value}-${item.maxplayers[0].$.value} Players`,
        rating: `${item.minage?.[0]?.$.value || '8'}+`,
        playtime: `${item.playingtime[0].$.value} minutes`,
        description: item.description[0].substring(0, 200) + '...',
        image: item.image[0],
        rules: `https://boardgamegeek.com/boardgame/${id}`
      });
    } catch (error) {
      console.error(`Error fetching board game ${id}:`, error);
    }
  }

  return games;
}

// Main handler
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const [videoGames, boardGames] = await Promise.all([
      fetchVideoGames(),
      fetchBoardGames()
    ]);

    const gameData = {
      ...videoGames,
      boardgames: boardGames
    };

    res.status(200).json(gameData);
  } catch (error) {
    console.error('Error in games API:', error);
    res.status(500).json({ error: 'Failed to fetch game data' });
  }
};