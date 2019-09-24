'use strict';

const bcryptjs = require('bcryptjs');
const Context = require('./context');

class Database {
  constructor(seedData, enableLogging = false) {
    this.courses = seedData.courses;
    this.users = seedData.users;
    this.enableLogging = enableLogging;
    this.context = new Context(`mongodb://${process.env.DB_HOST}:27017`, enableLogging);
  }

  log(message) {
    if (this.enableLogging) {
      console.info(message);
    }
  }

  async hashUserPasswords(users) {
    const usersWithHashedPasswords = [];

    for (const user of users) {
      const hashedPassword = await bcryptjs.hash(user.password, 10);
      usersWithHashedPasswords.push({ ...user, password: hashedPassword });
    }

    return usersWithHashedPasswords;
  }

  async init() {
    const dbName = 'fsjstd-teamproject';

    await this.context.connect(dbName);

    this.log('Hashing the user passwords...');
    const users = await this.hashUserPasswords(this.users);

    await this.context.insertDocuments('users', users);
    await this.context.insertDocuments('courses', this.courses);
  }
}

module.exports = Database;
