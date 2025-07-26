const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Data storage
const dataPath = path.join(__dirname, 'data');
const usersFile = path.join(dataPath, 'users.json');
const roomsFile = path.join(dataPath, 'rooms.json');
const bookingsFile = path.join(dataPath, 'bookings.json');

// Ensure data directory exists
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath);
}

// Initialize data files if they don't exist
const initializeData = () => {
    if (!fs.existsSync(usersFile)) {
        const defaultUsers = [
            {
                id: 1,
                username: 'admin',
                email: 'admin@hotel.com',
                password: bcrypt.hashSync('admin123', 10),
                role: 'admin'
            },
            {
                id: 2,
                username: 'user1',
                email: 'user1@example.com',
                password: bcrypt.hashSync('user123', 10),
                role: 'user'
            }
        ];
        fs.writeFileSync(usersFile, JSON.stringify(defaultUsers, null, 2));
    }

    if (!fs.existsSync(roomsFile)) {
        const defaultRooms = [
            {
                id: 1,
                number: '101',
                type: 'Standard',
                price: 100,
                capacity: 2,
                amenities: ['WiFi', 'TV', 'AC'],
                available: true
            },
            {
                id: 2,
                number: '102',
                type: 'Deluxe',
                price: 150,
                capacity: 3,
                amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'],
                available: true
            },
            {
                id: 3,
                number: '201',
                type: 'Suite',
                price: 250,
                capacity: 4,
                amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Balcony'],
                available: true
            }
        ];
        fs.writeFileSync(roomsFile, JSON.stringify(defaultRooms, null, 2));
    }

    if (!fs.existsSync(bookingsFile)) {
        fs.writeFileSync(bookingsFile, JSON.stringify([], null, 2));
    }
};

// Helper functions
const readData = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeData = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Function to update room availability based on current bookings
const updateRoomAvailability = (rooms, bookings) => {
    const today = new Date();
    
    rooms.forEach(room => {
        // Check if room has any active bookings
        const activeBookings = bookings.filter(booking => 
            booking.roomId === room.id && 
            booking.status === 'confirmed' &&
            new Date(booking.checkOut) > today
        );
        
        // Room is available if no active bookings
        const wasAvailable = room.available;
        room.available = activeBookings.length === 0;
        
        // Log changes for debugging
        if (wasAvailable !== room.available) {
            console.log(`Room ${room.number} availability changed from ${wasAvailable} to ${room.available}`);
        }
    });
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Initialize data
initializeData();

// Update room availability on server start
const updateInitialRoomAvailability = () => {
    try {
        const rooms = readData(roomsFile);
        const bookings = readData(bookingsFile);
        updateRoomAvailability(rooms, bookings);
        writeData(roomsFile, rooms);
        console.log('Room availability updated on server start');
    } catch (error) {
        console.error('Error updating room availability:', error);
    }
};

updateInitialRoomAvailability();

// Routes

// Authentication routes
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const users = readData(usersFile);
    
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
});

app.post('/api/auth/register', (req, res) => {
    const { username, email, password } = req.body;
    const users = readData(usersFile);
    
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
        id: users.length + 1,
        username,
        email,
        password: hashedPassword,
        role: 'user'
    };

    users.push(newUser);
    writeData(usersFile, users);

    const token = jwt.sign(
        { id: newUser.id, username: newUser.username, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.status(201).json({
        token,
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        }
    });
});

// Rooms routes
app.get('/api/rooms', (req, res) => {
    const rooms = readData(roomsFile);
    res.json(rooms);
});

app.get('/api/rooms/:id', (req, res) => {
    const rooms = readData(roomsFile);
    const room = rooms.find(r => r.id === parseInt(req.params.id));
    
    if (!room) {
        return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json(room);
});

// Admin endpoint to refresh room availability
app.post('/api/rooms/refresh-availability', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    
    try {
        const rooms = readData(roomsFile);
        const bookings = readData(bookingsFile);
        updateRoomAvailability(rooms, bookings);
        writeData(roomsFile, rooms);
        
        res.json({ message: 'Room availability updated successfully', rooms });
    } catch (error) {
        res.status(500).json({ message: 'Error updating room availability' });
    }
});

app.post('/api/rooms', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }

    const { number, type, price, capacity, amenities, image } = req.body;
    const rooms = readData(roomsFile);
    
    const newRoom = {
        id: rooms.length + 1,
        number,
        type,
        price,
        capacity,
        amenities,
        image: image || '',
        available: true
    };

    rooms.push(newRoom);
    writeData(roomsFile, rooms);
    
    res.status(201).json(newRoom);
});

app.put('/api/rooms/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }

    const { number, type, price, capacity, amenities, available, image } = req.body;
    const rooms = readData(roomsFile);
    const room = rooms.find(r => r.id === parseInt(req.params.id));
    
    if (!room) {
        return res.status(404).json({ message: 'Room not found' });
    }
    
    room.number = number || room.number;
    room.type = type || room.type;
    room.price = price || room.price;
    room.capacity = capacity || room.capacity;
    room.amenities = amenities || room.amenities;
    room.image = image !== undefined ? image : room.image;
    room.available = available !== undefined ? available : room.available;
    
    writeData(roomsFile, rooms);
    
    res.json(room);
});

// Bookings routes
app.get('/api/bookings', authenticateToken, (req, res) => {
    const bookings = readData(bookingsFile);
    
    if (req.user.role === 'admin') {
        res.json(bookings);
    } else {
        const userBookings = bookings.filter(b => b.userId === req.user.id);
        res.json(userBookings);
    }
});

app.get('/api/bookings/:id', authenticateToken, (req, res) => {
    const bookings = readData(bookingsFile);
    const booking = bookings.find(b => b.id === parseInt(req.params.id));
    
    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user has access to this booking
    if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(booking);
});

app.post('/api/bookings', authenticateToken, (req, res) => {
    const { roomId, checkIn, checkOut, guests } = req.body;
    const rooms = readData(roomsFile);
    const bookings = readData(bookingsFile);
    
    const room = rooms.find(r => r.id === roomId);
    if (!room) {
        return res.status(404).json({ message: 'Room not found' });
    }
    
    if (!room.available) {
        return res.status(400).json({ message: 'Room is not available' });
    }

    // Check for booking conflicts
    const conflictingBooking = bookings.find(b => 
        b.roomId === roomId && 
        b.status !== 'cancelled' &&
        ((new Date(checkIn) >= new Date(b.checkIn) && new Date(checkIn) < new Date(b.checkOut)) ||
         (new Date(checkOut) > new Date(b.checkIn) && new Date(checkOut) <= new Date(b.checkOut)))
    );

    if (conflictingBooking) {
        return res.status(400).json({ message: 'Room is already booked for these dates' });
    }

    const newBooking = {
        id: bookings.length + 1,
        userId: req.user.id,
        roomId,
        checkIn,
        checkOut,
        guests,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    writeData(bookingsFile, bookings);
    
    // Update room availability based on current bookings
    updateRoomAvailability(rooms, bookings);
    writeData(roomsFile, rooms);
    
    res.status(201).json(newBooking);
});

app.put('/api/bookings/:id', authenticateToken, (req, res) => {
    const { status } = req.body;
    const bookings = readData(bookingsFile);
    const rooms = readData(roomsFile);
    const booking = bookings.find(b => b.id === parseInt(req.params.id));
    
    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
    }
    
    booking.status = status;
    writeData(bookingsFile, bookings);
    
    // Update room availability after status change
    updateRoomAvailability(rooms, bookings);
    writeData(roomsFile, rooms);
    
    res.json(booking);
});

// Users routes (admin only)
app.get('/api/users', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    
    const users = readData(usersFile);
    const usersWithoutPassword = users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
    }));
    
    res.json(usersWithoutPassword);
});

app.put('/api/users/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }

    const { username, email, role } = req.body;
    const users = readData(usersFile);
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if email is already taken by another user
    if (email && email !== user.email) {
        const existingUser = users.find(u => u.email === email && u.id !== user.id);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
    }
    
    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;
    
    writeData(usersFile, users);
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 