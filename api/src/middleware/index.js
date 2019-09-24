'use strict';

const auth = require('./auth');
const course = require('./course');

module.exports = {
  authMiddleware: auth,
  courseMiddleware: course,
};
