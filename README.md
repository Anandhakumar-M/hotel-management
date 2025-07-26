# Hotel Management System

A full-stack hotel management application built with React.js, Vite, Node.js, and Express.js. This system allows users to browse rooms, make bookings, and provides comprehensive admin functionality for managing hotel operations.

## Features

### User Features
- **User Authentication**: Login and registration system with JWT
- **Room Browsing**: View available rooms with filtering and search
- **Room Booking**: Book rooms with date selection and guest count validation
- **Booking Management**: View and manage personal bookings
- **Booking Confirmation**: Detailed confirmation page with payment summary
- **Responsive Design**: Mobile-friendly interface with modern UI

### Admin Features
- **Admin Dashboard**: Comprehensive overview of hotel statistics and revenue
- **User Management**: View, edit, and manage all registered users
- **Room Management**: Create, edit, and manage room inventory with custom images
- **Booking Management**: View all bookings, update status, and detailed booking information
- **Revenue Tracking**: Real-time revenue calculation from confirmed bookings
- **Room Availability**: Automatic room availability updates based on bookings

## Technology Stack

### Frontend
- **React.js**: Modern UI framework with hooks
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing with protected routes
- **Axios**: HTTP client for API calls with interceptors
- **CSS3**: Modern styling with responsive design and animations

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework with middleware
- **bcryptjs**: Secure password hashing
- **jsonwebtoken**: JWT authentication and authorization
- **CORS**: Cross-origin resource sharing

### Data Storage
- **JSON Files**: Sample data stored in JSON format
- **File System**: Data persistence using Node.js fs module

## Project Structure

```
hotel-management/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Rooms.jsx
│   │   │   ├── BookRoom.jsx
│   │   │   ├── BookingConfirmation.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── EditUserForm.jsx
│   │   │   ├── EditRoomForm.jsx
│   │   │   └── Navbar.jsx
│   │   ├── services/        # API services
│   │   │   └── api.js
│   │   ├── App.jsx          # Main application component
│   │   └── main.jsx         # Application entry point
│   └── package.json
├── backend/                  # Node.js backend application
│   ├── server.js            # Express server with all endpoints
│   ├── data/                # JSON data files
│   │   ├── users.json
│   │   ├── rooms.json
│   │   └── bookings.json
│   └── package.json
├── assets/                   # Static assets
│   └── background_image.jpg
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Quick Start (Recommended)

1. Install all dependencies:
```bash
cd hotel-management
npm run install-all
```

2. Start both frontend and backend:
```bash
npm run dev
```

This will start:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

### Manual Setup

#### Backend Setup
```bash
cd hotel-management/backend
npm install
npm start
```

#### Frontend Setup
```bash
cd hotel-management/frontend
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms` - Create new room (admin only)
- `PUT /api/rooms/:id` - Update room details (admin only)
- `POST /api/rooms/refresh-availability` - Refresh room availability (admin only)

### Bookings
- `GET /api/bookings` - Get user's bookings (or all for admin)
- `GET /api/bookings/:id` - Get specific booking details
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking status

### Users
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/:id` - Update user details (admin only)

## Demo Credentials

### Admin Account
- Username: `admin`
- Password: `admin123`

### User Account
- Username: `user1`
- Password: `user123`

## Features Implemented

### React Hooks Used
- **useState**: Managing component state
- **useEffect**: Side effects and data fetching
- **useReducer**: Complex state management in booking form
- **useContext**: Authentication context and global state
- **useParams**: URL parameter extraction
- **useNavigate**: Programmatic navigation

### Advanced Features
- **Real-time Room Availability**: Automatic updates based on bookings
- **Image URL Management**: Custom room images with live preview
- **Currency Support**: Indian Rupee (₹) display throughout
- **Background Image**: Full-screen background with overlay
- **Modal Interfaces**: Edit forms for users and rooms
- **Form Validation**: Real-time validation with error messages
- **Responsive Design**: Mobile-first approach with breakpoints

### API Integration
- RESTful API calls using Axios
- JWT token authentication with interceptors
- Error handling and loading states
- Automatic token refresh

### Sample Data
The system includes sample data for:
- 3 different room types (Standard, Deluxe, Suite) with custom images
- 3 default users (admin and regular users)
- Empty bookings array for new installations
- High-quality room images from Pexels

## Key Features

1. **Responsive Design**: Mobile-friendly interface with modern UI
2. **Real-time Validation**: Form validation with error messages
3. **Booking Conflict Detection**: Prevents double bookings
4. **Role-based Access**: Different views for users and admins
5. **Modern UI**: Clean and intuitive user interface
6. **Data Persistence**: JSON file-based data storage
7. **Image Management**: Custom room images with URL support
8. **Currency Localization**: Indian Rupee (₹) throughout
9. **Admin Management**: Full CRUD operations for users and rooms
10. **Booking Management**: Comprehensive booking status management

## Usage

### For Users
1. **Registration/Login**: Create an account or login with demo credentials
2. **Browse Rooms**: View available rooms with filtering options
3. **Book a Room**: Select dates, number of guests, and confirm booking
4. **View Bookings**: Check booking status and detailed information
5. **Booking Confirmation**: View comprehensive booking details

### For Admins
1. **Dashboard Overview**: View hotel statistics and revenue
2. **User Management**: Edit user details, roles, and information
3. **Room Management**: Create, edit rooms with custom images and amenities
4. **Booking Management**: Update booking statuses and view details
5. **Revenue Tracking**: Monitor confirmed booking revenue

## Development

### Adding New Features
1. Create new components in `frontend/src/components/`
2. Add corresponding CSS files
3. Update routing in `App.jsx`
4. Add API endpoints in backend if needed
5. Update data models in JSON files

### Styling
The application uses modern CSS with:
- CSS Grid and Flexbox for layouts
- CSS variables for consistent theming
- Responsive design with media queries
- Smooth animations and transitions
- Background images with overlays

### Available Scripts
- `npm run install-all` - Install all dependencies
- `npm run dev` - Start both frontend and backend
- `npm run start-backend` - Start backend only
- `npm run start-frontend` - Start frontend only
- `npm run build` - Build for production

## Recent Updates

### v2.0 Features
- ✅ **Admin Edit Functionality**: Full CRUD operations for users and rooms
- ✅ **Image URL Support**: Custom room images with live preview
- ✅ **Currency Localization**: Indian Rupee (₹) throughout the app
- ✅ **Background Image**: Full-screen background with overlay
- ✅ **Enhanced UI**: Improved modals and form interfaces
- ✅ **Room Availability**: Automatic availability updates
- ✅ **Booking Management**: Enhanced booking status management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source 