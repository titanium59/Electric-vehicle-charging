const mongoose = require('mongoose');
const ChargingStation = require('./models/chargingStation');

// Connect to your MongoDB
mongoose.connect('mongodb://localhost:27017/evdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ownerId = '683f14893176493fc1fa44c5';

// Indian state bounding boxes (approximate)
const states = [
  { name: 'Maharashtra', lng: [72.6, 80.9], lat: [15.6, 22.1] },
  { name: 'Uttar Pradesh', lng: [77.0, 84.7], lat: [23.9, 28.5] },
  { name: 'Tamil Nadu', lng: [76.1, 80.3], lat: [8.1, 13.4] },
  { name: 'West Bengal', lng: [85.8, 89.9], lat: [21.5, 27.1] },
  { name: 'Karnataka', lng: [74.0, 78.6], lat: [11.5, 17.5] },
  { name: 'Gujarat', lng: [68.4, 74.5], lat: [20.1, 24.7] },
  { name: 'Rajasthan', lng: [69.3, 78.2], lat: [23.3, 28.7] },
  { name: 'Madhya Pradesh', lng: [74.0, 82.5], lat: [21.2, 26.9] },
  { name: 'Telangana', lng: [77.0, 81.1], lat: [15.9, 19.5] },
  { name: 'Kerala', lng: [74.0, 77.5], lat: [8.1, 12.8] },
];

function randomCoord([min, max]) {
  return +(Math.random() * (max - min) + min).toFixed(6);
}

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  // Delete all previous station data
  await ChargingStation.deleteMany({});
  console.log('Deleted all previous charging stations.');

  const statuses = ['active', 'inactive'];
  const connectorTypes = ['Type1', 'Type2', 'CCS', 'CHAdeMO', 'Tesla'];
  const stations = [];

  for (let i = 0; i < 2500; i++) {
    const state = randomFromArray(states);
    stations.push({
      name: `EV Station ${i + 1} (${state.name})`,
      location: {
        type: 'Point',
        coordinates: [
          randomCoord(state.lng), // Longitude
          randomCoord(state.lat), // Latitude
        ],
      },
      status: randomFromArray(statuses),
      powerOutput: Math.floor(Math.random() * 350) + 50, // 50-400 kW
      connectorType: randomFromArray(connectorTypes),
      owner: ownerId,
    });
  }

  await ChargingStation.insertMany(stations);
  console.log('Seeded 2,500 EV charging stations!');
  mongoose.connection.close();
}

seed();