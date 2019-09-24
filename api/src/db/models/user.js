'use strict';

/**
 * This module defines the User Mongoose schema
 * and exports the associated Mongoose model.
 *
 * @module models/user
 */

const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide a value for "First Name"'],
  },
  lastName: {
    type: String,
    required: [true, 'Please provide a value for "Last Name"'],
  },
  emailAddress: {
    type: String,
    required: [true, 'Please provide a value for "Email Address"'],
    match: [/^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i, 'Please provide a valid email address for "Email Address"'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a value for "Password"'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
