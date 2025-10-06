const axios = require('axios');
const NodeCache = require('node-cache');

class IGDBService {
  constructor() {
    this.clientId = process.env.IGDB_CLIENT_ID;
    this.clientSecret = process.env.IGDB_CLIENT_SECRET;
    this.accessToken = null;
    this.tokenExpiry = null;
    this.cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes
  }

  async getAccessToken() {
    // Check if token is still valid
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
        params: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials'
        }
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // Refresh 1 minute before expiry
      
      console.log('IGDB token obtained successfully');
      return this.accessToken;
    } catch (error) {
      console.error('Error getting IGDB access token:', error.message);
      throw error;
    }
  }

  async searchGames(query, platform = null) {
    const cacheKey = `search_${query}_${platform}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const token = await this.getAccessToken();
    
    try {
      let igdbQuery = `search "${query}"; fields name,cover.image_id,summary,genres.name,platforms.name,rating,first_release_date; limit 20;`;
      
      if (platform) {
        const platformIds = {
          'ps5': 167,
          'xbox': 169,
          'switch': 130
        };
        if (platformIds[platform]) {
          igdbQuery = `search "${query}"; fields name,cover.image_id,summary,genres.name,platforms.name,rating,first_release_date; where platforms = (${platformIds[platform]}); limit 20;`;
        }
      }

      const response = await axios.post('https://api.igdb.com/v4/games', igdbQuery, {
        headers: {
          'Client-ID': this.clientId,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain'
        }
      });

      const formattedData = this.formatGameData(response.data);
      this.cache.set(cacheKey, formattedData);
      return formattedData;
    } catch (error) {
      console.error('Error searching games:', error.message);
      throw error;
    }
  }

  async getGamesByIds(ids) {
    const cacheKey = `games_${ids.join('_')}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const token = await this.getAccessToken();
    
    try {
      const query = `fields name,cover.image_id,summary,genres.name,platforms.name,rating,first_release_date,age_ratings.rating,game_modes.name; where id = (${ids.join(',')}); limit 50;`;
      
      const response = await axios.post('https://api.igdb.com/v4/games', query, {
        headers: {
          'Client-ID': this.clientId,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain'
        }
      });

      const formattedData = this.formatGameData(response.data);
      this.cache.set(cacheKey, formattedData);
      return formattedData;
    } catch (error) {
      console.error('Error getting games by IDs:', error.message);
      throw error;
    }
  }

  formatGameData(games) {
    return games.map(game => {
      // Generate image URL
      let imageUrl = 'https://via.placeholder.com/300x400?text=No+Cover';
      if (game.cover && game.cover.image_id) {
        imageUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`;
      }

      // Format genres
      const genres = game.genres ? game.genres.map(g => g.name).join(', ') : 'Unknown';
      
      // Format platforms
      const platforms = game.platforms ? game.platforms.map(p => p.name).join(', ') : 'Unknown';

      // Get ESRB rating
      let rating = 'Not Rated';
      if (game.age_ratings && game.age_ratings.length > 0) {
        const esrbRating = game.age_ratings.find(r => r.rating >= 6 && r.rating <= 12);
        if (esrbRating) {
          const ratingMap = {
            6: 'RP',
            7: 'EC',
            8: 'E',
            9: 'E10+',
            10: 'T',
            11: 'M',
            12: 'AO'
          };
          rating = ratingMap[esrbRating.rating] || 'Not Rated';
        }
      }

      return {
        id: game.id,
        title: game.name,
        image: imageUrl,
        genre: genres,
        platforms: platforms,
        description: game.summary || 'No description available',
        rating: rating,
        score: game.rating ? Math.round(game.rating) : null,
        releaseDate: game.first_release_date 
          ? new Date(game.first_release_date * 1000).getFullYear() 
          : 'Unknown'
      };
    });
  }

  // Get predefined games for our gameroom
  async getGameroomGames() {
    // These are specific game IDs that we know we have in the gameroom
    const gameIds = {
      ps5: [
        11198, 
        119171, // God of War Ragnarök
        119277, // Horizon Forbidden West
        1905, // Gran Turismo 7
        256092, // Demon's Souls
        138669,
        214397 
      ],
      xbox: [
        1905,
135400,
11198,
125174,
204623,
1942,
3225,
125165,
308034,
256092,
1879,
111469,
120,
194682,
120619,
214397,
325608,
125624
      ],
      switch: [
        7346,   // The Legend of Zelda: Breath of the Wild
        18229,  // Mario Kart 8 Deluxe
        76073,  // Super Smash Bros. Ultimate
        116530, // Animal Crossing: New Horizons
        26758,  // Super Mario Odyssey
        146493  // Splatoon 3
      ]
    };

    try {
      const results = {};
      
      for (const [platform, ids] of Object.entries(gameIds)) {
        const games = await this.getGamesByIds(ids);
        results[platform] = games;
      }

      return results;
    } catch (error) {
      console.error('Error getting gameroom games:', error.message);
      // Return empty structure on error
      return { ps5: [], xbox: [], switch: [] };
    }
  }
}

module.exports = new IGDBService();