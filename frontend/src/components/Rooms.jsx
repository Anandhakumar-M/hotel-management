import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { roomsAPI } from '../services/api';
import './Rooms.css';

// Helper to get image for room
const getRoomImage = (room) => {
  if (room.image) {
    return room.image;
  }
  // Fallback to background image if no custom image URL
  return '/background_image.jpg';
};

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await roomsAPI.getAll();
        setRooms(response.data);
      } catch (err) {
        setError('Failed to load rooms');
        console.error('Rooms error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter(room => {
    if (filter === 'all') return true;
    if (filter === 'available') return room.available;
    if (filter === 'standard') return room.type.toLowerCase() === 'standard';
    if (filter === 'deluxe') return room.type.toLowerCase() === 'deluxe';
    if (filter === 'suite') return room.type.toLowerCase() === 'suite';
    return true;
  });

  if (loading) {
    return <div className="loading">Loading rooms...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="rooms">
      <div className="rooms-header">
        <h1>Available Rooms</h1>
        <p>Choose from our selection of comfortable and luxurious rooms</p>
      </div>

      <div className="rooms-filter">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Rooms</option>
          <option value="available">Available Only</option>
          <option value="standard">Standard</option>
          <option value="deluxe">Deluxe</option>
          <option value="suite">Suite</option>
        </select>
      </div>

      <div className="rooms-grid">
        {filteredRooms.length === 0 ? (
          <div className="no-rooms">
            <p>No rooms found matching your criteria.</p>
          </div>
        ) : (
          filteredRooms.map(room => (
            <div key={room.id} className="room-card">
              <div className="room-image" style={{ backgroundImage: `url(${getRoomImage(room)})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="room-type-badge">{room.type}</div>
                {!room.available && (
                  <div className="room-unavailable">Not Available</div>
                )}
              </div>
              
              <div className="room-content">
                <h3>Room {room.number}</h3>
                <p className="room-type">{room.type} Room</p>
                
                <div className="room-details">
                  <div className="room-info">
                    <span className="info-item">
                      <strong>Capacity:</strong> {room.capacity} guests
                    </span>
                    <span className="info-item">
                      <strong>Price:</strong> ₹{room.price}/night
                    </span>
                  </div>
                  
                  <div className="room-amenities">
                    <h4>Amenities:</h4>
                    <div className="amenities-list">
                      {room.amenities.map((amenity, index) => (
                        <span key={index} className="amenity-tag">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="room-actions">
                  {room.available ? (
                    <Link 
                      to={`/book-room/${room.id}`} 
                      className="btn-book"
                    >
                      Book Now
                    </Link>
                  ) : (
                    <button className="btn-unavailable" disabled>
                      Not Available
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Rooms; 