import { useEffect, useState } from 'react';
import './App.css';

interface ParkingSlot {
  id: string;
  type: string;
  isAvailable: boolean;
}

function App() {
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchSlots = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/slots');
      const data = await res.json();
      setSlots(data);
    } catch (err) {
      console.error(err);
      setMessage('Failed to fetch slots.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleReserve = async (slotId: string, type: string) => {
    try {
      setMessage('Reserving...');
      const res = await fetch('http://localhost:3000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotId,
          userId: 'employee123',
          date: new Date().toISOString(),
          requiredType: type,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Reservation failed');
      }

      setMessage(`Successfully reserved slot ${slotId}`);
      fetchSlots(); // Refresh list
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Error occurred');
    }
  };

  if (loading) return <div>Loading slots...</div>;

  return (
    <div className="App">
      <h1>Parking Reservation</h1>
      {message && <p className="message">{message}</p>}
      
      <div className="slot-list">
        {slots.length === 0 ? (
          <p>No available slots.</p>
        ) : (
          slots.map((slot) => (
            <div key={slot.id} className="slot-card">
              <h3>Slot: {slot.id}</h3>
              <p>Type: {slot.type === 'F' ? 'Electric' : 'Standard'}</p>
              <button onClick={() => handleReserve(slot.id, slot.type)}>
                Reserve
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
