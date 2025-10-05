import React, { useState } from 'react';
import './ReservationModal.css';

const ReservationModal = ({ slot, onClose, onSubmit, equipment }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    email: '',
    phone: '',
    equipment: slot?.equipment || '',
    date: slot?.date || '',
    startTime: slot?.time || '',
    endTime: '',
    recurring: 'none',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 12; hour <= 23; hour++) {
      times.push(`${hour}:00`);
      times.push(`${hour}:30`);
    }
    return times;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Reservation</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="reservation-form">
          <div className="form-section">
            <h3>Student Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Student ID *</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="Enter student ID"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@university.edu"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Reservation Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Equipment *</label>
                <select
                  name="equipment"
                  value={formData.equipment}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select equipment</option>
                  <optgroup label="Gaming Consoles">
                    <option value="PS5 Station 1">PS5 Station 1</option>
                    <option value="PS5 Station 2">PS5 Station 2</option>
                    <option value="Xbox Station">Xbox Station</option>
                    <option value="Switch Station">Switch Station</option>
                  </optgroup>
                  <optgroup label="Pool Tables">
                    <option value="Pool Table 1">Pool Table 1</option>
                    <option value="Pool Table 2">Pool Table 2</option>
                    <option value="Pool Table 3">Pool Table 3</option>
                    <option value="Pool Table 4">Pool Table 4</option>
                    <option value="Pool Table 5">Pool Table 5</option>
                    <option value="Pool Table 6">Pool Table 6</option>
                  </optgroup>
                  <optgroup label="Ping Pong">
                    <option value="Ping Pong 1">Ping Pong Table 1</option>
                    <option value="Ping Pong 2">Ping Pong Table 2</option>
                  </optgroup>
                  <optgroup label="Board Games">
                    <option value="Board Games">Board Game Station</option>
                  </optgroup>
                </select>
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Time *</label>
                <select
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select time</option>
                  {generateTimeOptions().map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>End Time *</label>
                <select
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select time</option>
                  {generateTimeOptions().map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Recurring</label>
                <select
                  name="recurring"
                  value={formData.recurring}
                  onChange={handleChange}
                >
                  <option value="none">No repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Additional Notes</h3>
            <div className="form-group">
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special requirements or notes..."
                rows="3"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Create Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;