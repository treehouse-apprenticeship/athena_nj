'use strict';

/**
 * This module defines the Repository class which contains
 * a collection of CRUD methods that are used in the REST API's route handlers.
 *
 * @module repository
 */

class Repository {
  constructor(models) {
    this.Course = models.Course;
    this.User = models.User;
  }

  getUsers() {
    return this.User.find().exec();
  }

  getUser(id) {
    return this.User.findById(id).exec();
  }

  getUserByEmailAddress(emailAddress) {
    return this.User
      .findOne({ emailAddress })
      .exec();
  }

  createUser(user) {
    return this.User.create(user);
  }

  getCourses() {
    return this.Course
      .find()
      .sort({ _id: 'asc' })
      .select('-__v')
      .populate('user', '-__v -password')
      .exec();
  }

  getCourse(id) {
    return this.Course
      .findById(id)
      .select('-__v')
      .populate('user', '-__v -password')
      .exec();
  }

  createCourse(course) {
    return this.Course.create(course);
  }

  async updateCourse(course) {
    return this.Course.updateOne({ _id: course._id }, course, { runValidators: true });
  }

  async deleteCourse(id) {
    return this.Course.deleteOne({ _id: id });
  }
}

module.exports = Repository;
