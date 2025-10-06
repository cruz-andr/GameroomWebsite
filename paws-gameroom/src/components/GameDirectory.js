import React, { useState, useEffect, useRef } from 'react';
import './GameDirectory.css';
import GameModal from './GameModal';

function GameDirectory() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGame, setSelectedGame] = useState(null);
  const [games, setGames] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch games from backend
  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/games');
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      const data = await response.json();
      
      // Transform the data to match our structure
      const transformedData = {
        ps5: {
          name: 'PlayStation 5',
          icon: '🎮',
          games: data.ps5 || []
        },
        xbox: {
          name: 'Xbox Series X',
          icon: '🎯',
          games: data.xbox || []
        },
        switch: {
          name: 'Nintendo Switch',
          icon: '🍄',
          games: data.switch || []
        },
        boardgames: {
          name: 'Board Games',
          icon: '🎲',
          games: [
            // Keep static board games data since they're not in IGDB
            {
              id: 'board-1',
              title: 'Settlers of Catan',
              genre: 'Strategy',
              players: '3-4 Players',
              rating: '10+',
              playtime: '60-90 minutes',
              description: 'Build settlements, cities, and roads on the island of Catan as you trade resources and compete for victory.',
              image: 'https://m.media-amazon.com/images/I/81+okm4IpfL._AC_SL1500_.jpg',
              rules: 'https://www.catan.com/sites/default/files/2021-06/catan_5th_ed_rules_200707.pdf'
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
              rules: 'https://ncdn0.daysofwonder.com/tickettoride/en/img/tt_rules_2015_en.pdf'
            },
            {
              id: 'board-3',
              title: 'Monopoly',
              genre: 'Economic',
              players: '2-8 Players',
              rating: '8+',
              playtime: '60-180 minutes',
              description: 'Buy, sell, and scheme your way to riches in the classic property trading game.',
              image: 'https://m.media-amazon.com/images/I/91RSg9MCGtL._AC_SL1500_.jpg',
              rules: 'https://www.hasbro.com/common/instruct/00009.pdf'
            },
            {
              id: 'board-4',
              title: 'Pandemic',
              genre: 'Cooperative Strategy',
              players: '2-4 Players',
              rating: '8+',
              playtime: '45 minutes',
              description: 'Work together as a team to treat infections around the world while gathering resources for cures.',
              image: 'https://m.media-amazon.com/images/I/71CVlZKm9BL._AC_SL1024_.jpg',
              rules: 'https://images.zmangames.com/filer_public/99/89/99890eea-4a77-4bfb-88d6-e077e1f6a5d7/zm7101_pandemic_rules.pdf'
            },
            {
              id: 'board-5',
              title: 'Scrabble',
              genre: 'Word Game',
              players: '2-4 Players',
              rating: '10+',
              playtime: '90 minutes',
              description: 'Form words on the board using letter tiles and score points based on letter values.',
              image: 'https://m.media-amazon.com/images/I/81Bvv1nKPJL._AC_SL1500_.jpg',
              rules: 'https://scrabble.hasbro.com/en-us/rules'
            },
            {
              id: 'board-6',
              title: 'Risk',
              genre: 'Strategy/War',
              players: '2-6 Players',
              rating: '10+',
              playtime: '120+ minutes',
              description: 'Conquer territories and continents in this classic game of global domination.',
              image: 'https://m.media-amazon.com/images/I/91gZ6moCdaL._AC_SL1500_.jpg',
              rules: 'https://www.hasbro.com/common/instruct/risk.pdf'
            },
            {
              id: 'board-7',
              title: 'Clue',
              genre: 'Mystery/Deduction',
              players: '3-6 Players',
              rating: '8+',
              playtime: '45 minutes',
              description: 'Solve the mystery of who committed the murder, where, and with what weapon.',
              image: 'https://m.media-amazon.com/images/I/91R6tODpufL._AC_SL1500_.jpg',
              rules: 'https://www.hasbro.com/common/instruct/Clue_2002.PDF'
            },
            {
              id: 'board-8',
              title: 'Codenames',
              genre: 'Word/Party',
              players: '4-8 Players',
              rating: '14+',
              playtime: '15-30 minutes',
              description: 'Two rival spymasters give one-word clues to help their teams guess words on the board.',
              image: 'https://m.media-amazon.com/images/I/71ZHkM7fHwL._AC_SL1024_.jpg',
              rules: 'https://czechgames.com/files/rules/codenames-rules-en.pdf'
            },
            {
              id: 'board-9',
              title: 'Chess',
              genre: 'Strategy',
              players: '2 Players',
              rating: '6+',
              playtime: '30-60 minutes',
              description: 'The classic game of strategic warfare between two armies.',
              image: 'https://m.media-amazon.com/images/I/71I1XJ7HWIL._AC_SL1500_.jpg',
              rules: 'https://www.chess.com/learn-how-to-play-chess'
            },
            {
              id: 'board-10',
              title: 'Checkers',
              genre: 'Strategy',
              players: '2 Players',
              rating: '6+',
              playtime: '30 minutes',
              description: 'Jump over opponent pieces to capture them and reach the other side to become a king.',
              image: 'https://m.media-amazon.com/images/I/91CwTjRcmPL._AC_SL1500_.jpg',
              rules: 'https://www.officialgamerules.org/checkers'
            },
            {
              id: 'board-11',
              title: 'Uno',
              genre: 'Card Game',
              players: '2-10 Players',
              rating: '7+',
              playtime: '30 minutes',
              description: 'Match colors and numbers to be the first to get rid of all your cards.',
              image: 'https://m.media-amazon.com/images/I/818a9hHEsqL._AC_SL1500_.jpg',
              rules: 'https://www.ultraboardgames.com/uno/game-rules.php'
            },
            {
              id: 'board-12',
              title: 'Jenga',
              genre: 'Dexterity',
              players: '1+ Players',
              rating: '6+',
              playtime: '20 minutes',
              description: 'Remove blocks from the tower and place them on top without toppling the structure.',
              image: 'https://m.media-amazon.com/images/I/71+8uulbmvL._AC_SL1500_.jpg',
              rules: 'https://www.jenga.com/about.php'
            }
          ]
        }
      };
      
      setGames(transformedData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError(err.message);
      setLoading(false);
      // Don't fall back to static data - just show error
    }
  };

  const getFilteredGames = () => {
    if (!games) return {};
    if (selectedCategory === 'all') {
      return games;
    }
    return { [selectedCategory]: games[selectedCategory] };
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const closeModal = () => {
    setSelectedGame(null);
  };

  // Create refs for each category's scroll container
  const scrollRefs = useRef({});

  const scrollLeft = (category) => {
    const container = scrollRefs.current[category];
    if (container) {
      container.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = (category) => {
    const container = scrollRefs.current[category];
    if (container) {
      container.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="game-directory">
        <h1>Game Directory</h1>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading games from IGDB...</p>
        </div>
      </div>
    );
  }

  if (error && !games) {
    return (
      <div className="game-directory">
        <h1>Game Directory</h1>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#DC2626' }}>Error loading games: {error}</p>
          <button onClick={fetchGames} style={{ marginTop: '1rem' }}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-directory">
      <h1>Game Directory</h1>
      <p className="directory-subtitle">
        Browse our collection of video games and board games
        {error && <span style={{ color: '#DC2626', fontSize: '0.9em' }}> (Using cached data)</span>}
      </p>

      <div className="filter-buttons">
        <button 
          className={selectedCategory === 'all' ? 'active' : ''}
          onClick={() => setSelectedCategory('all')}
        >
          All Games
        </button>
        <button 
          className={selectedCategory === 'ps5' ? 'active' : ''}
          onClick={() => setSelectedCategory('ps5')}
        >
          🎮 PlayStation 5
        </button>
        <button 
          className={selectedCategory === 'xbox' ? 'active' : ''}
          onClick={() => setSelectedCategory('xbox')}
        >
          🎯 Xbox Series X
        </button>
        <button 
          className={selectedCategory === 'switch' ? 'active' : ''}
          onClick={() => setSelectedCategory('switch')}
        >
          🍄 Nintendo Switch
        </button>
        <button 
          className={selectedCategory === 'boardgames' ? 'active' : ''}
          onClick={() => setSelectedCategory('boardgames')}
        >
          🎲 Board Games
        </button>
      </div>

      <div className="games-sections">
        {games && Object.entries(getFilteredGames()).map(([key, category]) => (
          <section key={key} className="games-category">
            <div className="category-header">
              <h2>
                <span className="category-icon">{category.icon}</span>
                {category.name}
              </h2>
            </div>
            
            {category.games && category.games.length > 0 && (
              <>
                <button 
                  className="scroll-button left" 
                  onClick={() => scrollLeft(key)}
                  aria-label="Scroll left"
                >
                  ‹
                </button>
                <button 
                  className="scroll-button right" 
                  onClick={() => scrollRight(key)}
                  aria-label="Scroll right"
                >
                  ›
                </button>
                <div 
                  className="games-grid" 
                  ref={el => scrollRefs.current[key] = el}
                >
                  {category.games.map(game => (
                    <div 
                      key={game.id} 
                      className="game-tile"
                      onClick={() => handleGameClick(game)}
                    >
                      <div className="game-image-container">
                        <img 
                          src={game.image} 
                          alt={game.title}
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/300x400/667eea/ffffff?text=${encodeURIComponent(game.title)}`;
                          }}
                        />
                        <div className="game-overlay">
                          <h3>{game.title}</h3>
                          <p>{game.genre}</p>
                          <span className="click-info">Click for details</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        ))}
      </div>

      <GameModal game={selectedGame} onClose={closeModal} />
    </div>
  );
}

export default GameDirectory;