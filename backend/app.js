const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const ChargingStation = require('./models/chargingStation');
const Owner = require('./models/owner');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/evdb');

// Middleware to authenticate owner
function auth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'your_jwt_secret');
    req.ownerId = decoded.ownerId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Register route
app.post('/owners/register', async (req, res) => {
  try {
    const { name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const owner = new Owner({ name, password: hashedPassword });
    await owner.save();
    res.status(201).json({ message: 'Owner registered' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login route
app.post('/owners/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    const owner = await Owner.findOne({ name });
    if (!owner) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ ownerId: owner._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token, owner: { id: owner._id, name: owner.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new charging station
app.post('/stations', auth, async (req, res) => {
  try {
    // owner field must be present in req.body
    const station = new ChargingStation(req.body);
    await station.save();
    res.status(201).json(station);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all charging stations (with owner info)
app.get('/stations', async (req, res) => {
  try {
    const stations = await ChargingStation.find().populate('owner');
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single charging station by ID (with owner info)
app.get('/stations/:id', async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id).populate('owner');
    if (!station) return res.status(404).json({ error: 'Not found' });
    res.json(station);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a charging station by ID (only owner can update)
app.put('/stations/:id', auth, async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id);
    if (!station) return res.status(404).json({ error: 'Not found' });
    if (station.owner.toString() !== req.ownerId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    Object.assign(station, req.body);
    await station.save();
    res.json(station);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a charging station by ID (only owner can delete)
app.delete('/stations/:id', auth, async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id);
    if (!station) return res.status(404).json({ error: 'Not found' });
    if (station.owner.toString() !== req.ownerId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await station.deleteOne();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Utsav');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});