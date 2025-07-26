import { useState, useEffect, useReducer } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomsAPI, bookingsAPI } from '../services/api';
import './BookRoom.css';

// Helper to get image for room
const getRoomImage = (room) => {
  if (room.image) {
    return room.image;
  }
  // Fallback to background image if no custom image URL
  return '/background_image.jpg';
};

// Reducer for booking form state
const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: {}
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.loading
      };
    default:
      return state;
  }
};

const BookRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [bookingState, dispatch] = useReducer(bookingReducer, {
    checkIn: '',
    checkOut: '',
    guests: 1,
    errors: {},
    loading: false
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await roomsAPI.getById(roomId);
        setRoom(response.data);
      } catch (err) {
        setError('Failed to load room details');
        console.error('Room error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  const handleInputChange = (field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
    // Clear error for this field when user starts typing
    if (bookingState.errors[field]) {
      dispatch({ 
        type: 'SET_ERRORS', 
        errors: { ...bookingState.errors, [field]: '' } 
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    const today = new Date();
    const checkInDate = new Date(bookingState.checkIn);
    const checkOutDate = new Date(bookingState.checkOut);

    if (!bookingState.checkIn) {
      errors.checkIn = 'Check-in date is required';
    } else if (checkInDate < today) {
      errors.checkIn = 'Check-in date cannot be in the past';
    }

    if (!bookingState.checkOut) {
      errors.checkOut = 'Check-out date is required';
    } else if (checkOutDate <= checkInDate) {
      errors.checkOut = 'Check-out date must be after check-in date';
    }

    if (bookingState.guests < 1) {
      errors.guests = 'At least 1 guest is required';
    } else if (bookingState.guests > room?.capacity) {
      errors.guests = `Maximum ${room?.capacity} guests allowed for this room`;
    }

    return errors;
  };

  const calculateTotalPrice = () => {
    if (!bookingState.checkIn || !bookingState.checkOut || !room) return 0;
    
    const checkIn = new Date(bookingState.checkIn);
    const checkOut = new Date(bookingState.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    return nights * room.price;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors });
      return;
    }

    dispatch({ type: 'SET_LOADING', loading: true });

    try {
      const bookingData = {
        roomId: parseInt(roomId),
        checkIn: bookingState.checkIn,
        checkOut: bookingState.checkOut,
        guests: bookingState.guests
      };

      const response = await bookingsAPI.create(bookingData);
      navigate(`/booking-confirmation/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  };

  if (loading) {
    return <div className="loading">Loading room details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!room) {
    return <div className="error-message">Room not found</div>;
  }

  if (!room.available) {
    return (
      <div className="room-unavailable-page">
        <h2>Room {room.number} is not available</h2>
        <p>This room is currently not available for booking.</p>
        <button onClick={() => navigate('/rooms')} className="btn-primary">
          Browse Other Rooms
        </button>
      </div>
    );
  }

  return (
    <div className="book-room">
      <div className="book-room-header">
        <div className="book-room-image" style={{ backgroundImage: `url(${getRoomImage(room)})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '250px', borderRadius: '12px', marginBottom: '24px' }} />
        <h1>Book Room {room.number}</h1>
        <p>{room.type} Room - ₹{room.price}/night</p>
      </div>

      <div className="book-room-container">
        <div className="room-summary">
          <h3>Room Details</h3>
          <div className="room-info">
            <p><strong>Type:</strong> {room.type}</p>
            <p><strong>Capacity:</strong> {room.capacity} guests</p>
            <p><strong>Price:</strong> ₹{room.price}/night</p>
            <div className="amenities">
              <strong>Amenities:</strong>
              <div className="amenities-list">
                {room.amenities.map((amenity, index) => (
                  <span key={index} className="amenity-tag">{amenity}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="booking-form-container">
          <h3>Booking Details</h3>
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label htmlFor="checkIn">Check-in Date</label>
              <input
                type="date"
                id="checkIn"
                value={bookingState.checkIn}
                onChange={(e) => handleInputChange('checkIn', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={bookingState.errors.checkIn ? 'error' : ''}
              />
              {bookingState.errors.checkIn && (
                <span className="error-text">{bookingState.errors.checkIn}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="checkOut">Check-out Date</label>
              <input
                type="date"
                id="checkOut"
                value={bookingState.checkOut}
                onChange={(e) => handleInputChange('checkOut', e.target.value)}
                min={bookingState.checkIn || new Date().toISOString().split('T')[0]}
                className={bookingState.errors.checkOut ? 'error' : ''}
              />
              {bookingState.errors.checkOut && (
                <span className="error-text">{bookingState.errors.checkOut}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="guests">Number of Guests</label>
              <input
                type="number"
                id="guests"
                value={bookingState.guests}
                onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                min="1"
                max={room.capacity}
                className={bookingState.errors.guests ? 'error' : ''}
              />
              {bookingState.errors.guests && (
                <span className="error-text">{bookingState.errors.guests}</span>
              )}
            </div>

            <div className="booking-summary">
              <h4>Booking Summary</h4>
              <div className="summary-item">
                <span>Room:</span>
                <span>Room {room.number} - {room.type}</span>
              </div>
              <div className="summary-item">
                <span>Price per night:</span>
                <span>₹{room.price}</span>
              </div>
              <div className="summary-item">
                <span>Total nights:</span>
                <span>
                  {bookingState.checkIn && bookingState.checkOut 
                    ? Math.ceil((new Date(bookingState.checkOut) - new Date(bookingState.checkIn)) / (1000 * 60 * 60 * 24))
                    : 0
                  }
                </span>
              </div>
              <div className="summary-item total">
                <span>Total Price:</span>
                <span>₹{calculateTotalPrice()}</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={bookingState.loading} 
              className="btn-book"
            >
              {bookingState.loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookRoom; 