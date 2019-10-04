'use strict';

/**
 * This module defines the Course Mongoose schema
 * and exports the associated Mongoose model.
 *
 * @module models/course
 */

const mongoose = require('mongoose');

const { Schema } = mongoose;

const courseSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a value for "User"'],
  },
  title: {
    type: String,
    required: [true, 'Please provide a value for "Title"'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a value for "Description"'],
  },
  estimatedTime: String,
  materialsNeeded: String,
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
