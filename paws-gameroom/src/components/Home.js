import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-image">
          <div className="hero-overlay">
            <div className="hero-content">
              <h1 className="hero-title">Paws Plays<br/>Gameroom</h1>
              <p className="hero-subtitle">Your ultimate gaming destination</p>
              <div className="hero-buttons">
                <Link to="/reservations" className="btn-primary">Reservations</Link>
                <Link to="/games" className="btn-secondary">Browse Games</Link>
                <Link to="/info" className="btn-secondary">Learn More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="events-section">
        <div className="container">
          <h2 className="section-title">Upcoming Events</h2>
          <div className="events-list">
            <div className="event-card">
              <div className="event-date">
                <span className="event-month">OCT</span>
                <span className="event-day">12</span>
              </div>
              <div className="event-details">
                <h3>Mario Kart Tournament</h3>
                <p className="event-info">
                  <span className="event-time">7:00 PM</span>
                  <span className="event-separator">•</span>
                  <span className="event-players">30 Players</span>
                </p>
                <p className="event-description">Join us for an epic Mario Kart tournament! Compete for prizes and bragging rights.</p>
              </div>
              <div className="event-action">
                <Link to="/reservations" className="event-register-btn">Register</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ways-to-play">
        <div className="container">
          <h2 className="section-title">
            Three Ways to <span className="highlight">Play</span>
          </h2>
          
          <div className="play-cards">
            <div className="play-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=500&h=400&fit=crop" alt="Free play" />
              </div>
              <h3>Free Play</h3>
              <p>Drop in anytime during our open hours and enjoy our selection of games, consoles, and tables. No reservation needed!</p>
            </div>

            <div className="play-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1511882150382-421056c89033?w=500&h=400&fit=crop" alt="Tournaments" />
              </div>
              <h3>Tournaments</h3>
              <p>Compete in our weekly tournaments! From Mario Kart to pool competitions, test your skills and win prizes.</p>
            </div>

            <div className="play-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&h=400&fit=crop" alt="Reservations" />
              </div>
              <h3>Reservations</h3>
              <p>Book your favorite gaming equipment in advance. Reserve pool tables, consoles, or ping pong tables for your guaranteed playtime.</p>
            </div>
          </div>

          <div className="play-cta">
            <Link to="/reservations" className="btn-large">How to play</Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">What We Offer</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🎱</div>
              <h4>6 Pool Tables</h4>
              <p>Professional-grade tables</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🏓</div>
              <h4>2 Ping Pong Tables</h4>
              <p>Tournament ready</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🎮</div>
              <h4>Gaming Consoles</h4>
              <p>PS5, Xbox, Switch</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🎲</div>
              <h4>Board Games</h4>
              <p>100+ games available</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🆓</div>
              <h4>Free Access</h4>
              <p>For all NU students</p>
            </div>
            <div className="feature">
              <div className="feature-icon">⏰</div>
              <h4>Book Ahead</h4>
              <p>Reserve up to 2 hours</p>
            </div>
          </div>
        </div>
      </section>

      <section className="discord-section">
        <div className="container">
          <div className="discord-container">
            <div className="discord-content">
              <h2 className="discord-title">
                Gamers United<br/>
                <span className="discord-subtitle">Teams Chat</span>
              </h2>
              <p className="discord-description">
                Join our growing community of gamers! Connect with fellow players, 
                find teammates for your next session, and stay updated on all 
                the latest events at Paws Plays Gameroom.
              </p>
              <a href="#" className="discord-btn">Join the Chat</a>
            </div>
            <div className="discord-preview">
              <div className="chat-window">
                <div className="chat-sidebar">
                  <div className="channel-item active"># general</div>
                  <div className="channel-item"># gaming-sessions</div>
                  <div className="channel-item"># tournaments</div>
                  <div className="channel-item"># lfg-looking-for-group</div>
                </div>
                <div className="chat-main">
                  <div className="chat-header">
                    <span className="channel-name"># general</span>
                  </div>
                  <div className="chat-messages">
                    <div className="message">
                      <div className="message-avatar">🎮</div>
                      <div className="message-content">
                        <div className="message-author">
                          <span className="author-name">Alex</span>
                          <span className="message-time">Today at 12:25 PM</span>
                        </div>
                        <div className="message-text">Is there a session this week?</div>
                        <div className="message-text">I am new to gaming and want to join!</div>
                      </div>
                    </div>
                    <div className="message">
                      <div className="message-avatar">🎯</div>
                      <div className="message-content">
                        <div className="message-author">
                          <span className="author-name">Sarah</span>
                          <span className="message-time">Today at 12:27 PM</span>
                        </div>
                        <div className="message-text">We can help you get started! Pool tournament tonight!</div>
                      </div>
                    </div>
                    <div className="message">
                      <div className="message-avatar">🎲</div>
                      <div className="message-content">
                        <div className="message-author">
                          <span className="author-name">Mike</span>
                          <span className="message-time">Today at 12:27 PM</span>
                        </div>
                        <div className="message-text">Yes there is!</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="discord-character">
                <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop" alt="Gaming character" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hours-section">
        <div className="container">
          <h2 className="section-title">Visit Us</h2>
          <div className="hours-grid">
            <div className="hours-card">
              <h3>Hours</h3>
              <div className="hours-list">
                <div className="hours-row">
                  <span>Monday - Thursday</span>
                  <span>12PM - 10PM</span>
                </div>
                <div className="hours-row">
                  <span>Friday - Saturday</span>
                  <span>12PM - 12AM</span>
                </div>
                <div className="hours-row">
                  <span>Sunday</span>
                  <span>1PM - 9PM</span>
                </div>
              </div>
            </div>
            <div className="hours-card">
              <h3>Location</h3>
              <p><strong>Room 424</strong><br/>Curry Student Center<br/>Northeastern University</p>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="map-link">
                Get Directions →
              </a>
            </div>
            <div className="hours-card info-card">
              <h3>Access Info</h3>
              <div className="access-info">
                <p className="free-badge">🎓 FREE for Northeastern Students</p>
                <p className="access-detail"><strong>Entry:</strong> Husky ID, CBORD, or GetMobile</p>
                <p className="access-detail"><strong>Max Booking:</strong> 2 hours per session</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;