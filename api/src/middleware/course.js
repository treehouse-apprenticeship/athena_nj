'use strict';

/**
 * This module defines Express middleware functions related to courses.
 */

const auth = require('./auth');
const { forbiddenResponse, notFoundResponse } = require('../routes/helpers');
const db = require('../db');

/**
 * Defines an Express middleware function for retrieving the current course
 * (as specified by the request's `id` route parameter) from the database.
 * @param {Request} req - An Express Request object
 * @param {Response} res - An Express Response object
 * @param {function} next - The next Express function to call
 * to execute the middleware succeeding the current middleware
 * @returns A response with a 404 HTTP status code if the course
 * wasn't found in the database or a call to the `next` function
 */
exports.getCourse = async (req, res, next) => {
  const courseId = req.params.id;
  const course = await db.repository.getCourse(courseId);
  if (!course) {
    return notFoundResponse(res, `Course not found for ID: ${courseId}`);
  }
  req.currentCourse = course;
  return next();
};

/**
 * Defines an Express middleware function for returning the current course.
 * @param {Request} req - An Express Request object
 */
const getCurrentCourse = req => req.currentCourse;
exports.getCurrentCourse = getCurrentCourse;

/**
 * Defines an Express middleware function for restricting access
 * to the current course to the course's owner.
 * @param {Request} req - An Express Request object
 * @param {Response} res - An Express Response object
 * @param {function} next - The next Express function to call
 * to execute the middleware succeeding the current middleware
 * @returns A response with a 403 HTTP status code if the course
 * isn't owned by the current user or a call to the `next` function
 */
exports.restrictAccessToCourse = (req, res, next) => {
  const user = auth.getCurrentUser(req);
  const course = getCurrentCourse(req);

  if (!course.user._id.equals(user._id)) {
    return forbiddenResponse(res, 'Action only allowed on courses you own.');
  }
  return next();
};
