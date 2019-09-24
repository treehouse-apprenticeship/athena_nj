'use strict';

/**
 * This module defines Express middleware functions related to authentication.
 *
 * The `basic-auth` npm package (see https://github.com/jshttp/basic-auth)
 * is used to parse the Authorization header.
 *
 * The `bcryptjs` npm package (see https://github.com/dcodeIO/bcrypt.js)
 * is used to hash user passwords.
 *
 * @module auth
 */

const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const { notAuthorizedResponse } = require('../routes/helpers');
const db = require('../db');

/**
 * Defines an Express middleware function for authenticating an incoming request.
 * @param {Request} req - An Express Request object
 * @param {Response} res - An Express Response object
 * @param {function} next - The next Express function to call
 * to execute the middleware succeeding the current middleware
 */
exports.authenticateUser = async (req, res, next) => {
  console.info('Parsing auth header...');
  let message = null;

  const credentials = auth(req);

  if (credentials) {
    // Retrieve the user by email address (i.e. user name = email address).
    const user = await db.repository
      .getUserByEmailAddress(credentials.name);

    if (user) {
      const authenticated = await bcryptjs
        .compare(credentials.pass, user.password);
      if (authenticated) {
        console.info(`Authentication successful for email address: ${user.emailAddress}`);

        // Remove the password from the user values object.
        const userValues = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          emailAddress: user.emailAddress,
        };

        // Store the filtered user values on the request.
        req.currentUser = userValues;
      } else {
        message = `Authentication failure for email address: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for email address: ${credentials.name}`;
    }
  } else {
    message = 'Auth header not found';
  }

  if (message) {
    console.warn(message);
    notAuthorizedResponse(res);
  } else {
    next();
  }
};

/**
 * Defines an Express middleware function for returning the currently authenticated user.
 * @param {Request} req - An Express Request object
 */
exports.getCurrentUser = req => req.currentUser;
