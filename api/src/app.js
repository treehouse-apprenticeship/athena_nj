'use strict';

// Load modules.
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./routes');
const { badRequestResponse } = require('./routes/helpers');

// Variables to enable error logging.
const enableDbErrorLogging = process.env.ENABLE_DB_ERROR_LOGGING === 'true';
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// Create the Express app.
const app = express();

// Set up request body JSON parsing.
app.use(express.json());

// Set up morgan which gives us HTTP request logging in the console.
app.use(morgan('dev'));

// Set up CORS.
app.use(cors());

// Set up our API routes.
routes(app, '/api');

// Set up a friendly greeting for the root route.
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// Send a 404 HTTP status code if no other route matched.
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// Set up a global DB error handler.
app.use((err, req, res, next) => {
  // Mongoose validation errors will have a name of "ValidationError".
  // For any other error names, pass handling to the next error handler.
  if (err.name === 'ValidationError') {
    const errors = [];

    // Each Mongoose validation error object is available
    // as a key on the `errors` property.
    Object.keys(err.errors).forEach((key) => {
      // Each Mongoose validation error object has a `message` property
      // that's the actual validation error message.
      const errorMessage = err.errors[key].message;
      errors.push(errorMessage);
    });

    // The errors reported by Mongoose are listed in reverse order
    // so reverse the array of errors so that they're returned to the
    // client in the expected order.
    errors.reverse();

    // If database error logging is enabled
    // then write the validation errors collection to the console.
    if (enableDbErrorLogging) {
      console.warn(`Database error handler: ${JSON.stringify(errors)}`);
    }

    // Now that we have our collection of validation errors
    // return a 400 HTTP status code.
    badRequestResponse(res, errors);
  } else {
    next(err);
  }
});

// Set up a global error handler.
app.use((err, req, res, next) => {
  // If global error logging is enabled
  // then write the error stack to the console.
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  // Return a 500 HTTP status code.
  // Note that we only return the error object if we aren't running in production.
  res.status(500).json({
    message: err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
});

module.exports = app;
