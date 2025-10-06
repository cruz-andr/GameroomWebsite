// IGDB API Service
// Documentation: https://api-docs.igdb.com/

class IGDBService {
  constructor() {
    this.clientId = process.env.REACT_APP_IGDB_CLIENT_ID;
    this.clientSecret = process.env.REACT_APP_IGDB_CLIENT_SECRET;
    this.accessToken = null;
    this.tokenExpiry = null;
    this.baseUrl = 'https://api.igdb.com/v4';
    this.corsProxy = 'https://cors-anywhere.herokuapp.com/'; // You may need to use your own CORS proxy
  }

  // Get OAuth access token
  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch(`https://id.twitch.tv/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get access token');
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      return this.accessToken;
    } catch (error) {
      console.error('Error getting IGDB access token:', error);
      return null;
    }
  }

  // Search for games by name
  async searchGames(gameName, platform = null) {
    const token = await this.getAccessToken();
    if (!token) return null;

    try {
      let query = `
        search "${gameName}";
        fields name, cover.image_id, cover.url, genres.name, 
               game_modes.name, player_perspectives.name, 
               first_release_date, summary, rating, platforms.name;
        limit 10;
      `;

      if (platform) {
        // Platform IDs: PS5=167, Xbox Series=169, Switch=130
        const platformMap = {
          'ps5': 167,
          'xbox': 169,
          'switch': 130
        };
        if (platformMap[platform]) {
          query += `where platforms = ${platformMap[platform]};`;
        }
      }

      const response = await fetch(`${this.corsProxy}${this.baseUrl}/games`, {
        method: 'POST',
        headers: {
          'Client-ID': this.clientId,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain',
        },
        body: query
      });

      if (!response.ok) {
        throw new Error('Failed to search games');
      }

      const games = await response.json();
      return this.formatGameData(games);
    } catch (error) {
      console.error('Error searching games:', error);
      return null;
    }
  }

  // Get game by specific ID
  async getGameById(gameId) {
    const token = await this.getAccessToken();
    if (!token) return null;

    try {
      const response = await fetch(`${this.corsProxy}${this.baseUrl}/games`, {
        method: 'POST',
        headers: {
          'Client-ID': this.clientId,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain',
        },
        body: `
          fields name, cover.image_id, cover.url, genres.name, 
                 game_modes.name, player_perspectives.name, 
                 first_release_date, summary, rating, platforms.name,
                 involved_companies.company.name, age_ratings.rating;
          where id = ${gameId};
        `
      });

      if (!response.ok) {
        throw new Error('Failed to get game');
      }

      const games = await response.json();
      return games.length > 0 ? this.formatGameData(games)[0] : null;
    } catch (error) {
      console.error('Error getting game:', error);
      return null;
    }
  }

  // Get multiple games by names (for initial load)
  async getGamesByNames(gameNames) {
    const token = await this.getAccessToken();
    if (!token) return [];

    const games = [];
    for (const name of gameNames) {
      const result = await this.searchGames(name);
      if (result && result.length > 0) {
        games.push(result[0]); // Take the first/best match
      }
    }
    return games;
  }

  // Format game data for our application
  formatGameData(games) {
    return games.map(game => {
      // Get high-quality cover image
      let imageUrl = 'https://via.placeholder.com/300x400?text=No+Cover';
      if (game.cover && game.cover.image_id) {
        // Use IGDB image sizing: cover_big = 264x374, 720p = 1280x720, 1080p = 1920x1080
        imageUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`;
      }

      // Format genres
      const genres = game.genres ? game.genres.map(g => g.name).join(', ') : 'Unknown';
      
      // Format platforms
      const platforms = game.platforms ? game.platforms.map(p => p.name).join(', ') : 'Unknown';

      // Get age rating
      let rating = 'Not Rated';
      if (game.age_ratings && game.age_ratings.length > 0) {
        const ratingMap = {
          1: 'Three',
          2: 'Seven',
          3: 'Twelve',
          4: 'Sixteen',
          5: 'Eighteen',
          6: 'RP',
          7: 'EC',
          8: 'E',
          9: 'E10+',
          10: 'T',
          11: 'M',
          12: 'AO'
        };
        rating = ratingMap[game.age_ratings[0].rating] || 'Not Rated';
      }

      return {
        id: game.id,
        title: game.name,
        image: imageUrl,
        genre: genres,
        platforms: platforms,
        summary: game.summary || 'No description available.',
        rating: rating,
        releaseDate: game.first_release_date 
          ? new Date(game.first_release_date * 1000).getFullYear() 
          : 'Unknown',
        score: game.rating ? Math.round(game.rating) : null
      };
    });
  }
}

// Create singleton instance
const igdbService = new IGDBService();

// Export default game data as fallback
export const defaultGameData = {
  ps5: {
    name: 'PlayStation 5',
    icon: '🎮',
    games: [
      {
        id: 'ps5-1',
        title: 'Spider-Man: Miles Morales',
        genre: 'Action/Adventure',
        players: '1 Player',
        rating: 'T (Teen)',
        playtime: '7-15 hours',
        description: 'Experience the rise of Miles Morales as the new hero masters incredible, explosive new powers to become his own Spider-Man.',
        image: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Spider-Man_Miles_Morales_cover.jpg',
        rules: 'https://www.ign.com/wikis/spider-man-miles-morales/Walkthrough'
      },
      {
        id: 'ps5-2',
        title: 'God of War Ragnarök',
        genre: 'Action/Adventure',
        players: '1 Player',
        rating: 'M (Mature)',
        playtime: '20-40 hours',
        description: 'Embark on an epic and heartfelt journey as Kratos and Atreus struggle with holding on and letting go.',
        image: 'https://upload.wikimedia.org/wikipedia/en/e/ee/God_of_War_Ragnar%C3%B6k_cover.jpg',
        rules: 'https://www.ign.com/wikis/god-of-war-ragnarok/Walkthrough'
      },
      // Add more default games...
    ]
  },
  xbox: {
    name: 'Xbox Series X',
    icon: '🎯',
    games: [
      {
        id: 'xbox-1',
        title: 'Halo Infinite',
        genre: 'First-Person Shooter',
        players: '1-4 Players (Online: 24)',
        rating: 'T (Teen)',
        playtime: '10-15 hours',
        description: 'When all hope is lost and humanity\'s fate hangs in the balance, the Master Chief is ready to confront the most ruthless foe he\'s ever faced.',
        image: 'https://upload.wikimedia.org/wikipedia/en/1/14/Halo_Infinite_cover_art.png',
        rules: 'https://www.ign.com/wikis/halo-infinite/Walkthrough'
      },
      // Add more default games...
    ]
  },
  switch: {
    name: 'Nintendo Switch',
    icon: '🍄',
    games: [
      {
        id: 'switch-1',
        title: 'The Legend of Zelda: Breath of the Wild',
        genre: 'Action/Adventure',
        players: '1 Player',
        rating: 'E10+ (Everyone 10+)',
        playtime: '50+ hours',
        description: 'Explore the wilds of Hyrule any way you like in this stunning open-world adventure.',
        image: 'https://upload.wikimedia.org/wikipedia/en/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg',
        rules: 'https://www.ign.com/wikis/the-legend-of-zelda-breath-of-the-wild/Walkthrough'
      },
      // Add more default games...
    ]
  }
};

export default igdbService;