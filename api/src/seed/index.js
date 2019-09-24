'use strict';

require('dotenv').config();

const promiseFinally = require('promise.prototype.finally');
const Database = require('./database');
const data = require('./data.json');

const database = new Database(data, true);

promiseFinally.shim();

database.init()
  .catch(err => console.error(err))
  .finally(() => process.exit());
