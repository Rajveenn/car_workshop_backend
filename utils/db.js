// File: utils/db.js
'use strict';
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Ensure URIs are set
const jobUri = process.env.MONGO_URI;
if (!jobUri) throw new Error('MONGO_URI environment variable is not defined');

const carUri = process.env.CAR_DATA_URI;
if (!carUri) throw new Error('CAR_DATA_URI environment variable is not defined');

// Log attempts
console.log('Connecting to JobDataDB with URI:', jobUri);
console.log('Connecting to CarDataDB with URI:', carUri);

// Create separate connections
const jobDb = mongoose.createConnection(jobUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const carDb = mongoose.createConnection(carUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// JobDataDB handlers
jobDb.on('error', err => console.error('JobDataDB connection error:', err));
jobDb.once('open', () => console.log('JobDataDB connected successfully'));

// CarDataDB handlers
carDb.on('error', err => console.error('CarDataDB connection error:', err));
carDb.once('open', () => console.log('CarDataDB connected successfully'));

module.exports = { jobDb, carDb };
