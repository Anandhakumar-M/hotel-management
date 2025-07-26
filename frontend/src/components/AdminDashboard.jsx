import { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { usersAPI, roomsAPI, bookingsAPI } from '../services/api';
import EditUserForm from './EditUserForm';
import EditRoomForm from './EditRoomForm';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching admin data...');
        const [usersResponse, roomsResponse, bookingsResponse] = await Promise.all([
          usersAPI.getAll(),
          roomsAPI.getAll(),
          bookingsAPI.getAll()
        ]);
        
        console.log('Users:', usersResponse.data);
        console.log('Rooms:', roomsResponse.data);
        console.log('Bookings:', bookingsResponse.data);
        
        setUsers(usersResponse.data);
        setRooms(roomsResponse.data);
        setBookings(bookingsResponse.data);
      } catch (err) {
        setError('Failed to load admin data');
        console.error('Admin dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRoomInfo = (roomId) => {
    return rooms.find(room => room.id === roomId);
  };

  const getUserInfo = (userId) => {
    return users.find(user => user.id === userId);
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

  const handleBookingStatusUpdate = async (bookingId, newStatus) => {
    try {
      console.log(`Updating booking ${bookingId} status to ${newStatus}`);
      await bookingsAPI.update(bookingId, { status: newStatus });
      console.log('Booking status updated successfully');
      
      // Refresh bookings data
      const response = await bookingsAPI.getAll();
      setBookings(response.data);
      console.log('Bookings refreshed:', response.data);
      
      // Show success message
      alert(`Booking status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update booking status:', err);
      alert('Failed to update booking status. Please try again.');
    }
  };

  const handleRefreshRoomAvailability = async () => {
    try {
      await roomsAPI.refreshAvailability();
      // Refresh rooms data
      const response = await roomsAPI.getAll();
      setRooms(response.data);
    } catch (err) {
      console.error('Failed to refresh room availability:', err);
    }
  };

  const handleViewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedBooking(null);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setShowRoomModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setEditingUser(null);
  };

  const closeRoomModal = () => {
    setShowRoomModal(false);
    setEditingRoom(null);
  };

  const handleUserUpdate = async (updatedUser) => {
    try {
      await usersAPI.update(updatedUser.id, updatedUser);
      // Refresh users data
      const response = await usersAPI.getAll();
      setUsers(response.data);
      closeUserModal();
      alert('User updated successfully!');
    } catch (err) {
      console.error('Failed to update user:', err);
      alert('Failed to update user. Please try again.');
    }
  };

  const handleRoomUpdate = async (updatedRoom) => {
    try {
      await roomsAPI.update(updatedRoom.id, updatedRoom);
      // Refresh rooms data
      const response = await roomsAPI.getAll();
      setRooms(response.data);
      closeRoomModal();
      alert('Room updated successfully!');
    } catch (err) {
      console.error('Failed to update room:', err);
      alert('Failed to update room. Please try again.');
    }
  };

  const handleCreateRoom = async (newRoom) => {
    try {
      await roomsAPI.create(newRoom);
      // Refresh rooms data
      const response = await roomsAPI.getAll();
      setRooms(response.data);
      setShowCreateRoomModal(false);
      alert('Room created successfully!');
    } catch (err) {
      console.error('Failed to create room:', err);
      alert('Failed to create room. Please try again.');
    }
  };

  const closeCreateRoomModal = () => {
    setShowCreateRoomModal(false);
  };

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (user?.role !== 'admin') {
    return <div className="error-message">Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, rooms, and bookings</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
        <button 
          className={`tab ${activeTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          Rooms ({rooms.length})
        </button>
        <button 
          className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings ({bookings.length})
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-number">{users.length}</p>
                <p className="stat-detail">
                  {users.filter(u => u.role === 'admin').length} admins, 
                  {users.filter(u => u.role === 'user').length} users
                </p>
              </div>
              
              <div className="stat-card">
                <h3>Total Rooms</h3>
                <p className="stat-number">{rooms.length}</p>
                <p className="stat-detail">
                  {rooms.filter(r => r.available).length} available, 
                  {rooms.filter(r => !r.available).length} occupied
                </p>
              </div>
              
              <div className="stat-card">
                <h3>Total Bookings</h3>
                <p className="stat-number">{bookings.length}</p>
                <p className="stat-detail">
                  {bookings.filter(b => b.status === 'confirmed').length} confirmed, 
                  {bookings.filter(b => b.status === 'cancelled').length} cancelled
                </p>
              </div>
              
              <div className="stat-card">
                <h3>Revenue</h3>
                <p className="stat-number">
                  ₹{bookings
                    .filter(b => b.status === 'confirmed')
                    .reduce((total, booking) => {
                      const room = getRoomInfo(booking.roomId);
                      if (room) {
                        const nights = Math.ceil(
                          (new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24)
                        );
                        return total + (nights * room.price);
                      }
                      return total;
                    }, 0)
                  }
                </p>
                <p className="stat-detail">From confirmed bookings</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <h2>User Management</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-small"
                          onClick={() => handleEditUser(user)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="rooms-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Room Management</h2>
              <div>
                <button onClick={() => setShowCreateRoomModal(true)} className="btn-primary" style={{ marginRight: '10px' }}>
                  Create Room
                </button>
                <button onClick={handleRefreshRoomAvailability} className="btn-primary">
                  Refresh Availability
                </button>
              </div>
            </div>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Room Number</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map(room => (
                    <tr key={room.id}>
                      <td>{room.id}</td>
                      <td>{room.number}</td>
                      <td>{room.type}</td>
                      <td>₹{room.price}</td>
                      <td>{room.capacity}</td>
                      <td>
                        <span className={`status ${room.available ? 'available' : 'occupied'}`}>
                          {room.available ? 'Available' : 'Occupied'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-small"
                          onClick={() => handleEditRoom(room)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Booking Management</h2>
              <button onClick={() => window.location.reload()} className="btn-primary">
                Refresh Data
              </button>
            </div>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <p>No bookings found.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Room</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Guests</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => {
                    const room = getRoomInfo(booking.roomId);
                    const bookingUser = getUserInfo(booking.userId);
                    return (
                      <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td>{bookingUser?.username}</td>
                        <td>{room?.number}</td>
                        <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                        <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                        <td>{booking.guests}</td>
                        <td>
                          <select 
                            value={booking.status}
                            onChange={(e) => handleBookingStatusUpdate(booking.id, e.target.value)}
                            className={`status-select ${getStatusColor(booking.status)}`}
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td>
                          <button 
                            className="btn-small"
                            onClick={() => handleViewBookingDetails(booking)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showBookingModal && selectedBooking && (
        <div className="modal-overlay" onClick={closeBookingModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Booking Details</h3>
              <button onClick={closeBookingModal} className="modal-close">&times;</button>
            </div>
            <div className="modal-body">
              <div className="booking-details-grid">
                <div className="detail-item">
                  <strong>Booking ID:</strong> #{selectedBooking.id}
                </div>
                <div className="detail-item">
                  <strong>User:</strong> {getUserInfo(selectedBooking.userId)?.username}
                </div>
                <div className="detail-item">
                  <strong>Room:</strong> {getRoomInfo(selectedBooking.roomId)?.number} - {getRoomInfo(selectedBooking.roomId)?.type}
                </div>
                <div className="detail-item">
                  <strong>Check-in:</strong> {new Date(selectedBooking.checkIn).toLocaleDateString()}
                </div>
                <div className="detail-item">
                  <strong>Check-out:</strong> {new Date(selectedBooking.checkOut).toLocaleDateString()}
                </div>
                <div className="detail-item">
                  <strong>Guests:</strong> {selectedBooking.guests}
                </div>
                <div className="detail-item">
                  <strong>Status:</strong> 
                  <span className={`status ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Created:</strong> {new Date(selectedBooking.createdAt).toLocaleString()}
                </div>
                <div className="detail-item">
                  <strong>Total Nights:</strong> {
                    Math.ceil((new Date(selectedBooking.checkOut) - new Date(selectedBooking.checkIn)) / (1000 * 60 * 60 * 24))
                  }
                </div>
                <div className="detail-item">
                  <strong>Total Price:</strong> ₹{
                    Math.ceil((new Date(selectedBooking.checkOut) - new Date(selectedBooking.checkIn)) / (1000 * 60 * 60 * 24)) * 
                    (getRoomInfo(selectedBooking.roomId)?.price || 0)
                  }
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={closeBookingModal} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showUserModal && editingUser && (
        <div className="modal-overlay" onClick={closeUserModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit User</h3>
              <button onClick={closeUserModal} className="modal-close">&times;</button>
            </div>
            <div className="modal-body">
              <EditUserForm 
                user={editingUser} 
                onSave={handleUserUpdate} 
                onCancel={closeUserModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {showRoomModal && editingRoom && (
        <div className="modal-overlay" onClick={closeRoomModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Room</h3>
              <button onClick={closeRoomModal} className="modal-close">&times;</button>
            </div>
            <div className="modal-body">
              <EditRoomForm 
                room={editingRoom} 
                onSave={handleRoomUpdate} 
                onCancel={closeRoomModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateRoomModal && (
        <div className="modal-overlay" onClick={closeCreateRoomModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Room</h3>
              <button onClick={closeCreateRoomModal} className="modal-close">&times;</button>
            </div>
            <div className="modal-body">
                      <EditRoomForm 
          room={{ number: '', type: 'standard', price: 0, capacity: 1, amenities: [], available: true, image: '' }}
          onSave={handleCreateRoom}
          onCancel={closeCreateRoomModal}
        />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 