import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingsAPI, roomsAPI } from '../services/api';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // Get specific booking by ID
        const bookingResponse = await bookingsAPI.getById(bookingId);
        setBooking(bookingResponse.data);

        // Get room details
        const roomResponse = await roomsAPI.getById(bookingResponse.data.roomId);
        setRoom(roomResponse.data);
      } catch (err) {
        setError('Failed to load booking details');
        console.error('Booking confirmation error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const calculateTotalPrice = () => {
    if (!booking || !room) return 0;
    
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    return nights * room.price;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'cancelled':
        return 'status-cancelled';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-pending';
    }
  };

  if (loading) {
    return <div className="loading">Loading booking confirmation...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!booking || !room) {
    return <div className="error-message">Booking not found</div>;
  }

  return (
    <div className="booking-confirmation">
      <div className="confirmation-header">
        <div className="success-icon">✅</div>
        <h1>Booking Confirmed!</h1>
        <p>Your booking has been successfully confirmed. Here are the details:</p>
      </div>

      <div className="confirmation-container">
        <div className="booking-details-card">
          <h2>Booking Information</h2>
          
          <div className="booking-info">
            <div className="info-row">
              <span className="label">Booking ID:</span>
              <span className="value">#{booking.id}</span>
            </div>
            
            <div className="info-row">
              <span className="label">Status:</span>
              <span className={`value status ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
            </div>
            
            <div className="info-row">
              <span className="label">Booking Date:</span>
              <span className="value">
                {new Date(booking.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="room-details-card">
          <h2>Room Details</h2>
          
          <div className="room-info">
            <div className="info-row">
              <span className="label">Room Number:</span>
              <span className="value">{room.number}</span>
            </div>
            
            <div className="info-row">
              <span className="label">Room Type:</span>
              <span className="value">{room.type}</span>
            </div>
            
            <div className="info-row">
              <span className="label">Capacity:</span>
              <span className="value">{room.capacity} guests</span>
            </div>
            
            <div className="info-row">
              <span className="label">Price per Night:</span>
                              <span className="value">₹{room.price}</span>
            </div>
          </div>

          <div className="amenities-section">
            <h4>Amenities:</h4>
            <div className="amenities-list">
              {room.amenities.map((amenity, index) => (
                <span key={index} className="amenity-tag">{amenity}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="stay-details-card">
          <h2>Stay Details</h2>
          
          <div className="stay-info">
            <div className="info-row">
              <span className="label">Check-in Date:</span>
              <span className="value">
                {new Date(booking.checkIn).toLocaleDateString()}
              </span>
            </div>
            
            <div className="info-row">
              <span className="label">Check-out Date:</span>
              <span className="value">
                {new Date(booking.checkOut).toLocaleDateString()}
              </span>
            </div>
            
            <div className="info-row">
              <span className="label">Number of Guests:</span>
              <span className="value">{booking.guests}</span>
            </div>
            
            <div className="info-row">
              <span className="label">Total Nights:</span>
              <span className="value">
                {Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))}
              </span>
            </div>
          </div>
        </div>

        <div className="payment-summary-card">
          <h2>Payment Summary</h2>
          
          <div className="payment-details">
            <div className="payment-row">
              <span>Price per night:</span>
              <span>₹{room.price}</span>
            </div>
            
            <div className="payment-row">
              <span>Number of nights:</span>
              <span>
                {Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))}
              </span>
            </div>
            
            <div className="payment-row total">
              <span>Total Amount:</span>
              <span>₹{calculateTotalPrice()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="confirmation-actions">
        <Link to="/dashboard" className="btn-primary">
          Go to Dashboard
        </Link>
        <Link to="/rooms" className="btn-secondary">
          Book Another Room
        </Link>
      </div>

      <div className="confirmation-footer">
        <p>
          <strong>Important:</strong> Please arrive at the hotel on your check-in date. 
          You can check in from 3:00 PM onwards. Check-out time is 11:00 AM.
        </p>
        <p>
          If you need to modify or cancel your booking, please contact our customer service.
        </p>
      </div>
    </div>
  );
};

export default BookingConfirmation; 