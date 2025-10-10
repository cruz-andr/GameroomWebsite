import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Tournaments.css';

function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tournaments');
      if (response.ok) {
        const data = await response.json();
        setTournaments(data);
      }
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      // Use default tournaments if API fails
      setTournaments(getDefaultTournaments());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultTournaments = () => [
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

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const getSpotsLeft = (max, current) => {
    const spots = max - current;
    if (spots <= 0) return <span className="spots-full">FULL</span>;
    if (spots <= 5) return <span className="spots-limited">{spots} spots left</span>;
    return <span className="spots-available">{spots} spots available</span>;
  };

  if (loading) {
    return (
      <div className="tournaments-loading">
        <div className="loading-spinner"></div>
        <p>Loading tournaments...</p>
      </div>
    );
  }

  return (
    <div className="tournaments">
      <div className="tournaments-header">
        <h1>Upcoming Tournaments</h1>
        <p>Join our FREE gaming tournaments! No entry fees, just fun and prizes!</p>
      </div>

      <div className="tournaments-grid">
        {tournaments.length === 0 ? (
          <div className="no-tournaments">
            <p>No tournaments scheduled at the moment. Check back soon!</p>
          </div>
        ) : (
          tournaments.map(tournament => (
            <div key={tournament.id} className="tournament-card">
              <div className="tournament-icon">{tournament.image}</div>
              <div className="tournament-content">
                <div className="tournament-header">
                  <h2>{tournament.name}</h2>
                  <span className="tournament-format">{tournament.format}</span>
                </div>
                
                <div className="tournament-game">{tournament.game}</div>
                
                <div className="tournament-details">
                  <div className="detail-item">
                    <span className="detail-label">📅</span>
                    <span>{formatDate(tournament.date)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">🕐</span>
                    <span>{tournament.time}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">👥</span>
                    <span>{tournament.currentPlayers}/{tournament.maxPlayers} players</span>
                  </div>
                </div>

                <p className="tournament-description">{tournament.description}</p>
                
                <div className="tournament-footer">
                  {getSpotsLeft(tournament.maxPlayers, tournament.currentPlayers)}
                  <Link 
                    to={`/tournaments/register/${tournament.id}`}
                    state={{ tournament }}
                    className={`btn-register ${tournament.maxPlayers - tournament.currentPlayers <= 0 ? 'disabled' : ''}`}
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="tournaments-info">
        <h2>Tournament Information</h2>
        <div className="info-grid">
          <div className="info-card">
            <h3>🎮 How to Participate</h3>
            <ul>
              <li>Register online using your NUID</li>
              <li>Arrive 15 minutes before start time</li>
              <li>Check in at the front desk</li>
              <li>Bring your student ID</li>
            </ul>
          </div>
          <div className="info-card">
            <h3>🏆 Prizes & Rewards</h3>
            <ul>
              <li>Trophies for top 3 finishers</li>
              <li>Free gameroom hours</li>
              <li>Exclusive merchandise</li>
              <li>Your name on our Wall of Champions</li>
            </ul>
          </div>
          <div className="info-card">
            <h3>📋 Rules & Guidelines</h3>
            <ul>
              <li>All tournaments are FREE to enter</li>
              <li>Open to all Northeastern students</li>
              <li>Good sportsmanship required</li>
              <li>Tournament rules explained at check-in</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tournaments;