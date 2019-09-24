'use strict';

/**
 * This module connects to the MongoDB database, instantiates and
 * exports an instance of the Repository class.
 *
 * The `mongoose` npm package (see https://mongoosejs.com/)
 * is used for all interaction with the database.
 *
 * @module db
 */

const mongoose = require('mongoose');
const Course = require('./models/course');
const User = require('./models/user');
const Repository = require('./repository');

// Connect to the MongoDB database using Mongoose.
mongoose.connect(`mongodb://${process.env.DB_HOST}:27017/fsjstd-teamproject`, { useNewUrlParser: true });

// Get a reference to the Mongoose Connection object
// and configure event listeners for the `error` and `open` events.
const { connection } = mongoose;
connection.on('error', console.error.bind(console, 'Connection error:'));
connection.once('open', () => {
  console.log('DB connection successful');
});

// Instantiate an instance of the Repository class
// passing in the Mongoose Course and User models.
// The Repository class contains a collection of CRUD methods
// that are used in the REST API's route handlers.
const repository = new Repository({ Course, User });

const db = {
  repository,
};

module.exports = db;
