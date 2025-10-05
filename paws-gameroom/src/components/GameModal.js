import React from 'react';
import './GameModal.css';

function GameModal({ game, onClose }) {
  if (!game) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-body">
          <div className="modal-image-section">
            <img 
              src={game.image} 
              alt={game.title}
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/300x400/667eea/ffffff?text=${encodeURIComponent(game.title)}`;
              }}
            />
          </div>
          
          <div className="modal-info-section">
            <h2>{game.title}</h2>
            {game.genre && <p className="game-genre">{game.genre}</p>}
            
            <div className="game-details">
              {game.players && (
                <div className="detail-item">
                  <strong>Players:</strong> {game.players}
                </div>
              )}
              {game.rating && (
                <div className="detail-item">
                  <strong>Rating:</strong> {game.rating}
                </div>
              )}
              {game.playtime && (
                <div className="detail-item">
                  <strong>Play Time:</strong> {game.playtime}
                </div>
              )}
            </div>
            
            <div className="game-description">
              <h3>Description</h3>
              <p>{game.description}</p>
            </div>
            
            {game.rules && (
              <div className="game-rules">
                <a 
                  href={game.rules} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="rules-link"
                >
                  View Game Rules / Guide
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameModal;