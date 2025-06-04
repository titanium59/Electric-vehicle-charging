const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChargingStationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String, // 'Point'
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'available'
  },
  powerOutput: {
    type: Number,
    required: true
  },
  connectorType: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Owner',
    required: true
  }
});

module.exports = mongoose.model('ChargingStation', ChargingStationSchema);