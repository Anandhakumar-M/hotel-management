import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { bookingsAPI, roomsAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsResponse, roomsResponse] = await Promise.all([
          bookingsAPI.getAll(),
          roomsAPI.getAll()
        ]);
        
        setBookings(bookingsResponse.data);
        setRooms(roomsResponse.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRoomInfo = (roomId) => {
    return rooms.find(room => room.id === roomId);
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
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.username}!</h1>
        <p>Manage your hotel bookings and explore available rooms</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-number">{bookings.length}</p>
        </div>
        <div className="stat-card">
          <h3>Available Rooms</h3>
          <p className="stat-number">{rooms.filter(room => room.available).length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Bookings</h3>
          <p className="stat-number">
            {bookings.filter(booking => booking.status === 'confirmed').length}
          </p>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/rooms" className="action-card">
          <h3>Browse Rooms</h3>
          <p>View all available rooms and their amenities</p>
        </Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="action-card">
            <h3>Admin Panel</h3>
            <p>Manage users, rooms, and bookings</p>
          </Link>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Your Recent Bookings</h2>
        {bookings.length === 0 ? (
          <div className="no-bookings">
            <p>You haven't made any bookings yet.</p>
            <Link to="/rooms" className="btn-primary">Browse Rooms</Link>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.slice(0, 5).map(booking => {
              const room = getRoomInfo(booking.roomId);
              return (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <h4>Room {room?.number} - {room?.type}</h4>
                    <span className={`status ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="booking-details">
                    <p><strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()}</p>
                    <p><strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString()}</p>
                    <p><strong>Guests:</strong> {booking.guests}</p>
                    <p><strong>Price:</strong> ₹{room?.price}/night</p>
                  </div>
                  <div className="booking-footer">
                    <span className="booking-date">
                      Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 