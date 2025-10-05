import React from 'react';
import CalendarView from './CalendarView';
import './Reservations.css';

function Reservations() {
  return (
    <div className="reservations-page">
      <CalendarView />
    </div>
  );
}

export default Reservations;