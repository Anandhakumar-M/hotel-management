# Quick Start Guide - Hotel Management System

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
# From the hotel-management directory
npm run install-all
```

### 2. Start Both Frontend and Backend
```bash
# Start both servers simultaneously
npm run dev
```

This will start:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

### 3. Access the Application
Open your browser and go to: http://localhost:5173

## 🔑 Demo Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`

### User Account
- **Username**: `user1`
- **Password**: `user123`

## 📱 Features to Test

### As a Regular User:
1. **Login** with user credentials
2. **Browse Rooms** - View available rooms with filters
3. **Book a Room** - Select dates and number of guests
4. **View Bookings** - Check your booking history
5. **Booking Confirmation** - See detailed booking information

### As an Admin:
1. **Login** with admin credentials
2. **Admin Dashboard** - View hotel statistics
3. **User Management** - View all registered users
4. **Room Management** - View room inventory
5. **Booking Management** - Update booking statuses

## 🛠️ Development

### Start Backend Only
```bash
npm run start-backend
```

### Start Frontend Only
```bash
npm run start-frontend
```

### Build for Production
```bash
npm run build
```

## 📁 Project Structure
```
hotel-management/
├── frontend/          # React application
├── backend/           # Node.js server
├── README.md         # Detailed documentation
└── QUICK_START.md    # This file
```

## 🔧 Troubleshooting

### Port Already in Use
If you get port conflicts:
- Backend: Change port in `backend/server.js` (line 8)
- Frontend: Vite will automatically use the next available port

### Data Reset
To reset all data, delete the `backend/data/` directory and restart the server.

## 📞 Support
For issues or questions, check the main README.md file for detailed documentation. 