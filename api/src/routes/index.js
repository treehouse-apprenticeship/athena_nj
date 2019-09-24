'use strict';

const courses = require('./courses');
const users = require('./users');
const errors = require('./errors');

/**
 * Function that adds the Express routers for the REST API's endpoints
 * to the Express Application object.
 * @param {Application} app - An Express Application object
 * @param {string} prefix - The prefix to use when adding the routers to the application
 */
module.exports = (app, prefix) => {
  app.use(`${prefix}/courses`, courses);
  app.use(`${prefix}/users`, users);

  // If we aren't running in production then
  // add the errors route handlers for testing purposes.
  if (process.env.NODE_ENV !== 'production') {
    app.use(`${prefix}/errors`, errors);
  }
};
