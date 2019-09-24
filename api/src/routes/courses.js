'use strict';

/**
 * This module defines the routes for the "/api/courses" endpoint.
 *
 * The `express-promise-router` npm package
 * (https://github.com/express-promise-router/express-promise-router)
 * is used in order to allow middleware to return promises.
 *
 * The `helpers` module provides a set of helper functions
 * for creating HTTP responses.
 *
 * @module courses
 */

const PromiseRouter = require('express-promise-router');
const {
  createdResponse,
  noContentResponse,
  successResponse,
} = require('./helpers');
const db = require('../db');
const {
  authMiddleware,
  courseMiddleware,
} = require('../middleware');

const { authenticateUser, getCurrentUser } = authMiddleware;
const {
  getCourse,
  getCurrentCourse,
  restrictAccessToCourse,
} = courseMiddleware;
const promiseRouter = new PromiseRouter();

promiseRouter.get('/', async (req, res) => {
  const courses = await db.repository.getCourses();
  successResponse(res, courses);
});

promiseRouter.get('/:id',
  getCourse,
  async (req, res) => {
    const course = getCurrentCourse(req);
    successResponse(res, course);
  });

promiseRouter.post('/',
  authenticateUser,
  async (req, res) => {
    const user = getCurrentUser(req);
    const courseToCreate = req.body;
    courseToCreate.user = user._id;
    const course = await db.repository.createCourse(courseToCreate);
    createdResponse(res, `/api/courses/${course._id}`);
  });

promiseRouter.put('/:id',
  authenticateUser,
  getCourse,
  restrictAccessToCourse,
  async (req, res) => {
    const user = getCurrentUser(req);
    const courseToUpdate = req.body;
    courseToUpdate.user = user._id;
    await db.repository.updateCourse(courseToUpdate);
    noContentResponse(res);
  });

promiseRouter.delete('/:id',
  authenticateUser,
  getCourse,
  restrictAccessToCourse,
  async (req, res) => {
    await db.repository.deleteCourse();
    noContentResponse(res);
  });

module.exports = promiseRouter;
