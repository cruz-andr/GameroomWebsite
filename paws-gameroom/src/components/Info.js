import React from 'react';
import './Info.css';

function Info() {
  return (
    <div className="info">
      <h1>About Paws Plays Gameroom</h1>
      
      <section className="about-section">
        <h2>Our Story</h2>
        <p>
          Paws Plays Gameroom is Northeastern University's premier gaming destination, located in 
          Room 424 of the Curry Student Center. We provide a vibrant space where students can 
          unwind, compete, and connect through gaming. Best of all, it's completely FREE for 
          all Northeastern students!
        </p>
      </section>

      <section className="contact-section">
        <h2>Contact Us</h2>
        <div className="contact-info">
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <div>
              <h3>Location</h3>
              <p>Room 424<br />Curry Student Center<br />Northeastern University</p>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <div>
              <h3>Phone</h3>
              <p>(555) 123-4567</p>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">✉️</span>
            <div>
              <h3>Email</h3>
              <p>info@pawsplaysgameroom.com</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing-section">
        <h2>Access & Pricing</h2>
        <div className="pricing-highlight">
          <h3>🎉 FREE for all Northeastern Students!</h3>
          <p>Simply show your Husky ID, use CBORD, or login with GetMobile to access the gameroom.</p>
        </div>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Entry Options</h3>
            <ul className="access-list">
              <li>Husky ID Card</li>
              <li>CBORD Digital ID</li>
              <li>GetMobile App</li>
            </ul>
          </div>
          <div className="pricing-card">
            <h3>Booking Limits</h3>
            <p className="price-note">Maximum 2 hours per session</p>
            <p className="price-note">Reserve equipment in advance to guarantee availability</p>
          </div>
          <div className="pricing-card">
            <h3>Walk-ins Welcome</h3>
            <p className="price-note">First come, first served</p>
            <p className="price-note">Subject to availability</p>
          </div>
          <div className="pricing-card">
            <h3>All Equipment Included</h3>
            <ul className="access-list">
              <li>6 Pool Tables</li>
              <li>2 Ping Pong Tables</li>
              <li>PS5, Xbox, Switch</li>
              <li>100+ Board Games</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="rules-section">
        <h2>House Rules</h2>
        <ul className="rules-list">
          <li>Treat all equipment with respect and care</li>
          <li>Clean up after yourself</li>
          <li>Be respectful to other players and staff</li>
          <li>No outside food or drinks allowed</li>
          <li>Children under 12 must be accompanied by an adult</li>
          <li>Report any equipment issues to staff immediately</li>
          <li>Have fun and play fair!</li>
        </ul>
      </section>

      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3>Do I need to make a reservation?</h3>
          <p>Reservations are recommended, especially on weekends, but walk-ins are welcome based on availability.</p>
        </div>
        <div className="faq-item">
          <h3>Can I bring my own gaming equipment?</h3>
          <p>You're welcome to bring your own controllers or board games, but we provide all necessary equipment.</p>
        </div>
        <div className="faq-item">
          <h3>Is there parking available?</h3>
          <p>Use Northeastern University parking facilities. Check the university website for current parking options and rates.</p>
        </div>
        <div className="faq-item">
          <h3>Is it really free?</h3>
          <p>Yes! Completely free for all current Northeastern students with valid ID or digital access.</p>
        </div>
        <div className="faq-item">
          <h3>How long can I book equipment?</h3>
          <p>You can book equipment for a maximum of 2 hours per session to ensure fair access for all students.</p>
        </div>
      </section>

      <section className="social-section">
        <h2>Follow Us</h2>
        <div className="social-links">
          <a href="#" className="social-link">Facebook</a>
          <a href="#" className="social-link">Instagram</a>
          <a href="#" className="social-link">Twitter</a>
          <a href="#" className="social-link">TikTok</a>
        </div>
      </section>
    </div>
  );
}

export default Info;