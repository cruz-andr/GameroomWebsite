import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './TournamentRegistration.css';

function TournamentRegistration() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const tournament = location.state?.tournament;

  const [formData, setFormData] = useState({
    name: '',
    nuid: '',
    email: '',
    studentType: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.nuid.trim()) {
      newErrors.nuid = 'NUID is required';
    } else if (!/^\d{9}$/.test(formData.nuid)) {
      newErrors.nuid = 'NUID must be 9 digits';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    } else if (!formData.email.endsWith('@northeastern.edu') && !formData.email.endsWith('@husky.neu.edu')) {
      newErrors.email = 'Please use your Northeastern email';
    }

    if (!formData.studentType) {
      newErrors.studentType = 'Please select your student type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await fetch(`http://localhost:5000/api/tournaments/${id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tournamentId: id,
          tournamentName: tournament?.name
        })
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/tournaments');
        }, 3000);
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'Unable to submit registration. Please try again later.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="registration-success">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h2>Registration Successful!</h2>
          <p>You've been registered for {tournament?.name || 'the tournament'}.</p>
          <p>Check your email for confirmation details.</p>
          <p className="redirect-message">Redirecting to tournaments page...</p>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="registration-error">
        <h2>Tournament Not Found</h2>
        <p>Please select a tournament from the <a href="/tournaments">tournaments page</a>.</p>
      </div>
    );
  }

  return (
    <div className="tournament-registration">
      <div className="registration-container">
        <div className="registration-header">
          <h1>Tournament Registration</h1>
          <div className="tournament-info">
            <h2>{tournament.name}</h2>
            <div className="tournament-meta">
              <span>📅 {new Date(tournament.date).toLocaleDateString()}</span>
              <span>🕐 {tournament.time}</span>
              <span>🎮 {tournament.game}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-section">
            <h3>Student Information</h3>
            <p className="form-note">All tournaments are FREE - no payment required!</p>
            
            <div className="form-group">
              <label htmlFor="name">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="nuid">
                NUID <span className="required">*</span>
              </label>
              <input
                type="text"
                id="nuid"
                name="nuid"
                value={formData.nuid}
                onChange={handleChange}
                placeholder="Enter your 9-digit NUID"
                maxLength="9"
                className={errors.nuid ? 'error' : ''}
              />
              {errors.nuid && <span className="error-message">{errors.nuid}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Northeastern Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.name@northeastern.edu"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="studentType">
                Student Type <span className="required">*</span>
              </label>
              <select
                id="studentType"
                name="studentType"
                value={formData.studentType}
                onChange={handleChange}
                className={errors.studentType ? 'error' : ''}
              >
                <option value="">Select your student type</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="graduate">Graduate</option>
              </select>
              {errors.studentType && <span className="error-message">{errors.studentType}</span>}
            </div>
          </div>

          {errors.submit && (
            <div className="submit-error">
              {errors.submit}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/tournaments')}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-submit"
            >
              {submitting ? 'Registering...' : 'Register for Tournament'}
            </button>
          </div>
        </form>

        <div className="registration-footer">
          <h3>Important Information</h3>
          <ul>
            <li>Registration closes 1 hour before tournament start time</li>
            <li>Please arrive 15 minutes early for check-in</li>
            <li>Bring your Northeastern student ID</li>
            <li>All skill levels are welcome!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TournamentRegistration;