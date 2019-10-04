'use strict';

/**
 * This module defines a set of helper functions for creating HTTP responses.
 *
 * @module helpers
 */

exports.successResponse = (res, data) => {
  if (Array.isArray(data)) {
    res.json({ data });
  } else {
    res.json({ data: [data] });
  }
};

exports.createdResponse = (res, location) => {
  res.status(201).location(location).json();
};

exports.noContentResponse = (res) => {
  res.status(204).json();
};

exports.badRequestResponse = (res, errors) => {
  res.status(400).json({ message: 'Validation Failed', errors });
};

exports.notAuthorizedResponse = (res) => {
  res.status(401).json({ message: 'Access Denied' });
};

exports.forbiddenResponse = (res, message) => {
  if (message) {
    res.status(403).json({ message });
  } else {
    res.status(403).json();
  }
};

exports.notFoundResponse = (res, message) => {
  if (message) {
    res.status(404).json({ message });
  } else {
    res.status(404).json();
  }
};

exports.serverErrorResponse = (res, err, data) => {
  if (data) {
    res.status(500)
      .json({ message: err.message, error: err, data });
  } else {
    res.status(500)
      .json({ message: err.message, error: err });
  }
};
