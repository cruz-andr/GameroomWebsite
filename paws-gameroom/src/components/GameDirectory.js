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
          games: data.boardgames || []
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
          <p>Loading games from IGDB and BoardGameGeek...</p>
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