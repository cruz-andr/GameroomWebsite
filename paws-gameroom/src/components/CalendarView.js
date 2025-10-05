import React, { useState, useCallback, useRef } from 'react';
import moment from 'moment';
import './CalendarView.css';
import ReservationModal from './ReservationModal';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [viewType, setViewType] = useState('day'); // day, week, month
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [draggedReservation, setDraggedReservation] = useState(null);
  const [reservations, setReservations] = useState([
    {
      id: 1,
      studentName: 'Vyom N',
      equipment: 'PS5 Station 1',
      date: moment().format('YYYY-MM-DD'),
      startTime: '16:00',
      endTime: '18:00',
      color: '#DC2626'
    },
    {
      id: 2,
      studentName: 'Sourabh P',
      equipment: 'PS5 Station 2',
      date: moment().format('YYYY-MM-DD'),
      startTime: '17:00',
      endTime: '19:00',
      color: '#34C759'
    },
    {
      id: 3,
      studentName: 'Andres Cruz',
      equipment: 'Pool Table 1',
      date: moment().format('YYYY-MM-DD'),
      startTime: '20:00',
      endTime: '22:00',
      color: '#DC2626'
    }
  ]);

  const equipment = [
    { id: 1, name: 'PS5 Station 1', type: 'console' },
    { id: 2, name: 'PS5 Station 2', type: 'console' },
    { id: 3, name: 'Xbox Station', type: 'console' },
    { id: 4, name: 'Switch Station', type: 'console' },
    { id: 5, name: 'Pool Table 1', type: 'pool' },
    { id: 6, name: 'Pool Table 2', type: 'pool' },
    { id: 7, name: 'Pool Table 3', type: 'pool' },
    { id: 8, name: 'Pool Table 4', type: 'pool' },
    { id: 9, name: 'Pool Table 5', type: 'pool' },
    { id: 10, name: 'Pool Table 6', type: 'pool' },
    { id: 11, name: 'Ping Pong 1', type: 'pingpong' },
    { id: 12, name: 'Ping Pong 2', type: 'pingpong' },
    { id: 13, name: 'Board Games', type: 'boardgame' }
  ];

  const timeSlots = [];
  for (let hour = 12; hour <= 23; hour++) {
    timeSlots.push(`${hour}:00`);
  }

  const navigateDate = (direction) => {
    if (viewType === 'day') {
      setCurrentDate(moment(currentDate).add(direction, 'day'));
    } else if (viewType === 'week') {
      setCurrentDate(moment(currentDate).add(direction, 'week'));
    } else {
      setCurrentDate(moment(currentDate).add(direction, 'month'));
    }
  };

  const handleSlotClick = (time, equipmentItem) => {
    setSelectedSlot({
      date: currentDate.format('YYYY-MM-DD'),
      time,
      equipment: equipmentItem.name
    });
    setShowModal(true);
  };

  const handleReservationSubmit = (reservationData) => {
    const newReservation = {
      id: reservations.length + 1,
      ...reservationData,
      color: '#DC2626'
    };
    setReservations([...reservations, newReservation]);
    setShowModal(false);
  };

  const getReservationForSlot = (time, equipmentName) => {
    const hour = parseInt(time.split(':')[0]);
    return reservations.find(res => {
      const startHour = parseInt(res.startTime.split(':')[0]);
      const endHour = parseInt(res.endTime.split(':')[0]);
      return res.equipment === equipmentName && 
             res.date === currentDate.format('YYYY-MM-DD') &&
             hour >= startHour && hour < endHour;
    });
  };

  const getReservationHeight = (reservation) => {
    const startHour = parseInt(reservation.startTime.split(':')[0]);
    const endHour = parseInt(reservation.endTime.split(':')[0]);
    return (endHour - startHour) * 60; // 60px per hour
  };

  const getReservationTop = (reservation, time) => {
    const slotHour = parseInt(time.split(':')[0]);
    const startHour = parseInt(reservation.startTime.split(':')[0]);
    return slotHour === startHour ? 0 : -1000; // Hide if not start slot
  };

  const handleDragStart = (e, reservation) => {
    setDraggedReservation(reservation);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, time, equipmentItem) => {
    e.preventDefault();
    if (!draggedReservation) return;

    const duration = parseInt(draggedReservation.endTime.split(':')[0]) - 
                     parseInt(draggedReservation.startTime.split(':')[0]);
    const newStartHour = parseInt(time.split(':')[0]);
    const newEndHour = newStartHour + duration;

    if (newEndHour > 23) return; // Don't allow drop if it goes past closing

    const updatedReservations = reservations.map(res => {
      if (res.id === draggedReservation.id) {
        return {
          ...res,
          equipment: equipmentItem.name,
          startTime: time,
          endTime: `${newEndHour}:00`
        };
      }
      return res;
    });

    setReservations(updatedReservations);
    setDraggedReservation(null);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-controls">
          <div className="view-switcher">
            <button 
              className={viewType === 'day' ? 'active' : ''}
              onClick={() => setViewType('day')}
            >
              Day
            </button>
            <button 
              className={viewType === 'week' ? 'active' : ''}
              onClick={() => setViewType('week')}
            >
              Week
            </button>
            <button 
              className={viewType === 'month' ? 'active' : ''}
              onClick={() => setViewType('month')}
            >
              Month
            </button>
          </div>

          <div className="date-navigation">
            <button className="nav-btn" onClick={() => navigateDate(-1)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 15L7 10L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h2 className="current-date">
              {currentDate.format('dddd, MMMM D, YYYY')}
            </h2>
            <button className="nav-btn" onClick={() => navigateDate(1)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M8 5L13 10L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="calendar-actions">
            <button className="today-btn" onClick={() => setCurrentDate(moment())}>
              Today
            </button>
            <button className="filter-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 5H13M5 8H11M7 11H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Filters
            </button>
          </div>
        </div>
      </div>

      {viewType === 'day' && (
        <div className="calendar-grid">
          <div className="time-column">
            <div className="time-header"></div>
            {timeSlots.map(time => (
              <div key={time} className="time-slot">
                <span>{time}</span>
              </div>
            ))}
          </div>

          <div className="equipment-columns">
            {equipment.map(equipmentItem => (
              <div key={equipmentItem.id} className="equipment-column">
                <div className="equipment-header">
                  <span className="equipment-name">{equipmentItem.name}</span>
                  {equipmentItem.type === 'console' && '🎮'}
                  {equipmentItem.type === 'pool' && '🎱'}
                  {equipmentItem.type === 'pingpong' && '🏓'}
                  {equipmentItem.type === 'boardgame' && '🎲'}
                </div>
                {timeSlots.map(time => {
                  const reservation = getReservationForSlot(time, equipmentItem.name);
                  const isStartSlot = reservation && 
                    parseInt(reservation.startTime.split(':')[0]) === parseInt(time.split(':')[0]);
                  
                  return (
                    <div
                      key={`${equipmentItem.id}-${time}`}
                      className={`slot ${reservation ? 'occupied' : 'available'} ${draggedReservation ? 'drag-active' : ''}`}
                      onClick={() => !reservation && handleSlotClick(time, equipmentItem)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, time, equipmentItem)}
                    >
                      {isStartSlot && reservation && (
                        <div 
                          className="reservation-block"
                          draggable
                          onDragStart={(e) => handleDragStart(e, reservation)}
                          style={{
                            backgroundColor: reservation.color,
                            height: `${getReservationHeight(reservation)}px`,
                            zIndex: 10
                          }}
                        >
                          <div className="reservation-content">
                            <span className="reservation-name">{reservation.studentName}</span>
                            <span className="reservation-time">
                              {reservation.startTime} - {reservation.endTime}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {viewType === 'week' && (
        <div className="week-view">
          <div className="week-message">Week view coming soon...</div>
        </div>
      )}

      {viewType === 'month' && (
        <div className="month-view">
          <div className="month-message">Month view coming soon...</div>
        </div>
      )}

      {showModal && (
        <ReservationModal
          slot={selectedSlot}
          onClose={() => setShowModal(false)}
          onSubmit={handleReservationSubmit}
          equipment={equipment}
        />
      )}

      <button className="fab-add" onClick={() => setShowModal(true)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
};

export default CalendarView;