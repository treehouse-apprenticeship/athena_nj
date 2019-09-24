'use strict';

/**
 * This module defines route handlers that throw errors
 * in order to facilitate testing of error handlers.
 *
 * The `express-promise-router` npm package
 * (https://github.com/express-promise-router/express-promise-router)
 * is used in order to allow middleware to return promises.
 *
 * @module errors
 */

const PromiseRouter = require('express-promise-router');

function errorAsync() {
  return Promise.reject(new Error('Simulated async error'));
}

const promiseRouter = new PromiseRouter();

promiseRouter.get('/', () => {
  throw new Error('Test error');
});

promiseRouter.get('/async', async () => {
  await errorAsync();
});

module.exports = promiseRouter;
