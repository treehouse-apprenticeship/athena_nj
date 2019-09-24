'use strict';

/**
 * This module defines the routes for the "/api/users" endpoint.
 *
 * The `express-promise-router` npm package
 * (https://github.com/express-promise-router/express-promise-router)
 * is used in order to allow middleware to return promises.
 *
 * The `bcryptjs` npm package (see https://github.com/dcodeIO/bcrypt.js)
 * is used to hash user passwords.
 *
 * The `helpers` module provides a set of helper methods
 * for creating HTTP responses.
 *
 * @module users
 */

const PromiseRouter = require('express-promise-router');
const bcryptjs = require('bcryptjs');
const {
  createdResponse,
  successResponse,
} = require('./helpers');
const db = require('../db');
const { authMiddleware } = require('../middleware');

const { authenticateUser, getCurrentUser } = authMiddleware;
const promiseRouter = new PromiseRouter();

promiseRouter.get('/',
  authenticateUser,
  async (req, res) => {
    const user = getCurrentUser(req);
    successResponse(res, user);
  });

promiseRouter.post('/', async (req, res) => {
  const user = req.body;

  // encrypt the new user's password (if available)
  if (user.password) {
    user.password = bcryptjs.hash(user.password, 10);
  }

  await db.repository.createUser(user);
  createdResponse(res, '/');
});

module.exports = promiseRouter;
