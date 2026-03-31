import { useEffect, useState } from 'react';
import './index.css';

interface ParkingSlot {
  id: string;
  type: string;
  isAvailable: boolean;
  checkedIn: boolean;
}

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const COLS_PER_ROW = 10;
const EV_ROWS = ['A', 'F'];

/**
 * Floor Painted Icons
 */
const StandardCarIcon = () => (
  <svg className="floor-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  </svg>
);

const ElectricCarIcon = () => (
  <svg className="floor-icon ev" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    <path d="M12 2l-2 5h4l-2 5" transform="translate(0, 1) scale(0.6)" fill="white" />
    <path d="M7 10l5 5 5-5" transform="translate(0, 1.5) scale(0.4)" fill="#3b82f6" />
  </svg>
);

/**
 * Realistic Top-Down Car Component
 */
const TopDownCar = ({ color = '#4b5563' }) => (
  <div className="car-container">
    <div className="car-body" style={{ backgroundColor: color }}>
      <div className="car-windshield front"></div>
      <div className="car-windshield back"></div>
      <div className="car-lights front left"></div>
      <div className="car-lights front right"></div>
      <div className="car-lights back left"></div>
      <div className="car-lights back right"></div>
      <div className="car-roof"></div>
    </div>
  </div>
);

function App() {
  const [availableSlots, setAvailableSlots] = useState<ParkingSlot[]>([]);
  const [myReservations, setMyReservations] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState('employee123');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [reservingId, setReservingId] = useState<string | null>(null);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/slots');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setAvailableSlots(data);
    } catch (err) {
      console.error(err);
      setMessage('❌ Connection Error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyReservations = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/reservations/user/${currentUser}`);
      if (!res.ok) throw new Error('Failed to fetch reservations');
      const data = await res.json();
      setMyReservations(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSlots();
    fetchMyReservations();
  }, [currentUser]);

  const handleReserve = async (slotId: string, type: string) => {
    try {
      setReservingId(slotId);
      setMessage('');
      const res = await fetch('http://localhost:3000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotId,
          userId: currentUser,
          date: new Date().toISOString(),
          requiredType: type,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Reservation failed');
      }

      setMessage(`✅ Spot ${slotId} reserved`);
      setTimeout(() => setMessage(''), 3000);
      fetchSlots();
      fetchMyReservations();
    } catch (err: any) {
      setMessage(`❌ ${err.message || 'Error'}`);
    } finally {
      setReservingId(null);
    }
  };

  const handleCheckIn = async (reservationId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/api/reservations/${reservationId}/check-in`, {
        method: 'POST',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Check-in failed');
      }

      setMessage('✅ Check-in successful!');
      setTimeout(() => setMessage(''), 3000);
      fetchMyReservations();
    } catch (err: any) {
      setMessage(`❌ ${err.message || 'Error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTrigger11AM = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/debug/trigger-11am', {
        method: 'POST',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Trigger failed');
      }

      setMessage('⏰ 11 AM simulation triggered!');
      setTimeout(() => setMessage(''), 3000);
      fetchSlots();
      fetchMyReservations();
    } catch (err: any) {
      setMessage(`❌ ${err.message || 'Error'}`);
    } finally {
      setLoading(false);
    }
  };

  const isSlotAvailable = (id: string) => {
    return availableSlots.find(s => s.id === id);
  };

  return (
    <div className="parking-lot-view">
      <div className="asphalt-texture"></div>

      <header className="control-panel">
        <div className="user-simulator">
          <label>Simulate User:</label>
          <select value={currentUser} onChange={(e) => setCurrentUser(e.target.value)}>
            <option value="employee123">Employee A (Standard)</option>
            <option value="employee456">Employee B (Standard)</option>
            <option value="employee789">Employee C (Electric)</option>
          </select>
          <button onClick={handleTrigger11AM} className="btn-debug">
            Simulate 11 AM
          </button>
        </div>

        <div className="status-overview">
          <div className="status-item">
            <span className="count">{availableSlots.filter(s => s.isAvailable).length}</span>
            <span className="label">Available Spaces</span>
          </div>
          <div className="status-item">
            <span className="count occupied">{availableSlots.filter(s => !s.isAvailable).length}</span>
            <span className="label">Occupied</span>
          </div>
        </div>

        {myReservations.length > 0 && (
          <div className="my-current-reservation">
            <h3>My active reservation</h3>
            {myReservations.map(res => (
              <div key={res.id} className={`reservation-card ${res.checkedIn ? 'checked-in' : 'pending'}`}>
                <span className="res-details">Spot <strong>{res.slotId}</strong></span>
                {res.checkedIn ? (
                  <span className="status-badge success">Checked-in</span>
                ) : (
                  <button onClick={() => handleCheckIn(res.id)} className="btn-checkin">Check-in</button>
                )}
              </div>
            ))}
          </div>
        )}

        {message && (
          <div className={`status-toast ${message.includes('❌') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </header>

      <main className="parking-floor">
        <div className="gateway entry">
          <div className="road-text">ENTRY</div>
          <div className="arrow-down"></div>
        </div>

        <div className="aisles-container">
          {ROWS.map((rowLabel, rowIndex) => (
            <div key={rowLabel} className="parking-strip">
              <div className="slot-line">
                <div className="row-divider-label">{rowLabel}</div>
                <div className="spots-row">
                  {Array.from({ length: COLS_PER_ROW }, (_, colIndex) => {
                    const slotID = `${rowLabel}${(colIndex + 1).toString().padStart(2, '0')}`;
                    const slotData = isSlotAvailable(slotID);
                    const isEV = EV_ROWS.includes(rowLabel);

                    return (
                      <div
                        key={slotID}
                        className={`parking-space ${slotData?.isAvailable ? 'empty' : 'filled'} ${isEV ? 'ev-zone' : ''} ${slotData?.checkedIn ? 'checked-in' : ''}`}
                        onClick={() => slotData?.isAvailable && handleReserve(slotID, slotData.type)}
                      >
                        <div className="space-markings">
                          <div className="side-line left"></div>
                          <div className="side-line right"></div>
                          <div className="stop-line"></div>
                        </div>

                        <div className="floor-id">{slotID}</div>

                        <div className="floor-icon-container">
                          {isEV ? <ElectricCarIcon /> : <StandardCarIcon />}
                        </div>

                        {reservingId === slotID ? (
                          <div className="spot-loader"></div>
                        ) : !slotData?.isAvailable ? (
                          <>
                            <TopDownCar color={rowIndex % 2 === 0 ? '#1e293b' : '#334155'} />
                            {slotData?.checkedIn && (
                              <div className="checkin-status">CHECKED-IN</div>
                            )}
                          </>
                        ) : (
                          <div className="reserve-prompt">RESERVE</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {rowIndex < ROWS.length - 1 && (
                <div className="driving-aisle">
                  <div className={`nav-arrow ${rowIndex % 2 === 0 ? 'to-right' : 'to-left'}`}></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="gateway exit">
          <div className="arrow-down"></div>
          <div className="road-text">EXIT</div>
        </div>
      </main>

      {loading && (
        <div className="overlay-loading">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}

export default App;
