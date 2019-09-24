'use strict';

/**
 * This module contains integration tests which can be ran
 * by running the `test` or `test-once` npm scripts.
 *
 * The `supertest` npm package (see https://github.com/visionmedia/supertest)
 * is used throughout these tests, which provides a high-level abstraction
 * for testing HTTP.
 */

require('dotenv').config();

const {
  after,
  before,
  beforeEach,
  describe,
  it,
} = require('mocha');
const chai = require('chai');
const request = require('supertest');
const app = require('./app');
const Database = require('./seed/database');
const data = require('./seed/data.json');

const { expect } = chai;
chai.should();

chai.use(require('chai-string'));

const database = new Database(data);

const testUser = {
  emailAddress: 'joe@smith.com',
  password: 'joepassword',
};

describe('App', () => {
  before(async () => {
    await database.init();
  });

  describe('root route', () => {
    it('should return a friendly message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).to.equal(200);
      expect(res.body.message).to.equal('Welcome to the REST API project!');
    });
  });

  describe('default route handler', () => {
    it('should return a route not found message', async () => {
      const res = await request(app).get('/asdf');
      expect(res.statusCode).to.equal(404);
      expect(res.body.message).to.equal('Route Not Found');
    });
  });

  describe('global error handler', () => {
    it('should return an error message', async () => {
      const res = await request(app).get('/api/errors');
      expect(res.statusCode).to.equal(500);
      expect(res.body.message).to.equal('Test error');
      expect(res.body.error).to.not.be.null;
    });

    it('should handle errors from async route handlers', async () => {
      const res = await request(app).get('/api/errors/async');
      expect(res.statusCode).to.equal(500);
      expect(res.body.message).to.equal('Simulated async error');
      expect(res.body.error).to.not.be.null;
    });
  });

  describe('courses endpoint', () => {
    beforeEach(async () => {
      await database.init();
    });

    const courses = [
      {
        _id: '57029ed4795118be119cc440',
        title: 'Build a Basic Bookcase',
        description: "High-end furniture projects are great to dream about. But unless you have a well-equipped shop and some serious woodworking experience to draw on, it can be difficult to turn the dream into a reality.\n\nNot every piece of furniture needs to be a museum showpiece, though. Often a simple design does the job just as well and the experience gained in completing it goes a long way toward making the next project even better.\n\nOur pine bookcase, for example, features simple construction and it's designed to be built with basic woodworking tools. Yet, the finished project is a worthy and useful addition to any room of the house. While it's meant to rest on the floor, you can convert the bookcase to a wall-mounted storage unit by leaving off the baseboard. You can secure the cabinet to the wall by screwing through the cabinet cleats into the wall studs.\n\nWe made the case out of materials available at most building-supply dealers and lumberyards, including 1/2 x 3/4-in. parting strip, 1 x 2, 1 x 4 and 1 x 10 common pine and 1/4-in.-thick lauan plywood. Assembly is quick and easy with glue and nails, and when you're done with construction you have the option of a painted or clear finish.\n\nAs for basic tools, you'll need a portable circular saw, hammer, block plane, combination square, tape measure, metal rule, two clamps, nail set and putty knife. Other supplies include glue, nails, sandpaper, wood filler and varnish or paint and shellac.\n\nThe specifications that follow will produce a bookcase with overall dimensions of 10 3/4 in. deep x 34 in. wide x 48 in. tall. While the depth of the case is directly tied to the 1 x 10 stock, you can vary the height, width and shelf spacing to suit your needs. Keep in mind, though, that extending the width of the cabinet may require the addition of central shelf supports.",
        estimatedTime: '12 hours',
        materialsNeeded: '* 1/2 x 3/4 inch parting strip\n* 1 x 2 common pine\n* 1 x 4 common pine\n* 1 x 10 common pine\n* 1/4 inch thick lauan plywood\n* Finishing Nails\n* Sandpaper\n* Wood Glue\n* Wood Filler\n* Minwax Oil Based Polyurethane\n',
        user: {
          _id: '57029ed4795118be119cc437',
          firstName: 'Joe',
          lastName: 'Smith',
          emailAddress: 'joe@smith.com',
        },
      },
      {
        _id: '57029ed4795118be119cc441',
        title: 'Learn How to Program',
        description: "In this course, you'll learn how to write code like a pro!",
        estimatedTime: '6 hours',
        materialsNeeded: '* Notebook computer running Mac OS X or Windows\n* Text editor',
        user: {
          _id: '57029ed4795118be119cc438',
          firstName: 'Sally',
          lastName: 'Jones',
          emailAddress: 'sally@jones.com',
        },
      },
      {
        _id: '57029ed4795118be119cc442',
        title: 'Learn How to Test Programs',
        description: "In this course, you'll learn how to test programs.",
        user: {
          _id: '57029ed4795118be119cc438',
          firstName: 'Sally',
          lastName: 'Jones',
          emailAddress: 'sally@jones.com',
        },
      },
    ];

    describe('root route', () => {
      describe('GET request', () => {
        it('should return a list of courses', async () => {
          const res = await request(app)
            .get('/api/courses');

          res.statusCode.should.equal(200);
          res.body.should.eql({ data: courses });
        });
      });

      describe('POST request', () => {
        it('should require authentication when posting', async () => {
          const res = await request(app).post('/api/courses');
          expect(res.statusCode).to.equal(401);
          expect(res.body.message).to.equal('Access Denied');
        });

        it('should create a new course', async () => {
          const res = await request(app)
            .post('/api/courses')
            .auth(testUser.emailAddress, testUser.password)
            .send({
              title: 'New Course',
              description: 'Some description...',
            });

          expect(res.statusCode).to.equal(201);
          expect(res.body).to.be.empty;
          res.header.location.should.startWith('/api/courses/');

          const res2 = await request(app)
            .get(res.header.location)
            .auth(testUser.emailAddress, testUser.password);

          expect(res2.statusCode).to.equal(200);

          const course = res2.body.data[0];

          expect(course).to.not.be.null;
          expect(course.title).to.equal('New Course');
          expect(course.description).to.equal('Some description...');
          expect(course.user._id).to.equal('57029ed4795118be119cc437');
        });

        it('should return error messages when supplying incomplete data', async () => {
          const res = await request(app)
            .post('/api/courses')
            .auth(testUser.emailAddress, testUser.password)
            .send({});

          res.statusCode.should.equal(400);
          res.body.should.not.be.empty;
          res.body.message.should.equal('Validation Failed');
          res.body.errors.should.eql([
            'Please provide a value for "Title"',
            'Please provide a value for "Description"',
          ]);
        });
      });
    });

    describe('"/:id" route', () => {
      describe('GET request', () => {
        it('should return a course', async () => {
          const res = await request(app)
            .get('/api/courses/57029ed4795118be119cc440');

          res.statusCode.should.equal(200);
          res.body.should.eql({ data: [courses[0]] });
        });

        it('should return an error message when supplying an invalid course ID', async () => {
          const res = await request(app)
            .get('/api/courses/111122223333444455556666');

          res.statusCode.should.equal(404);
          res.body.should.eql({ message: 'Course not found for ID: 111122223333444455556666' });
        });
      });

      describe('PUT request', () => {
        it('should require authentication', async () => {
          const res = await request(app)
            .put('/api/courses/57029ed4795118be119cc440');

          res.statusCode.should.equal(401);
          res.body.should.eql({ message: 'Access Denied' });
        });

        it('should update a course', async () => {
          const updatedCourse = Object.assign({}, courses[0]);

          updatedCourse.title = 'Updated Course';

          const res = await request(app)
            .put(`/api/courses/${updatedCourse._id}`)
            .auth(testUser.emailAddress, testUser.password)
            .send(updatedCourse);

          res.statusCode.should.equal(204);
          res.body.should.be.empty;

          const res2 = await request(app)
            .get(`/api/courses/${updatedCourse._id}`);

          res2.statusCode.should.equal(200);
          res2.body.should.eql({ data: [updatedCourse] });
        });

        it('should return error messages when supplying incomplete data', async () => {
          const res = await request(app)
            .put('/api/courses/57029ed4795118be119cc440')
            .auth(testUser.emailAddress, testUser.password)
            .send({
              title: null,
              description: null,
            });

          res.statusCode.should.equal(400);
          res.body.should.not.be.empty;
          res.body.message.should.equal('Validation Failed');
          res.body.errors.should.eql([
            'Please provide a value for "Title"',
            'Please provide a value for "Description"',
          ]);
        });

        it('should ignore changes to the course owner', async () => {
          const updatedCourse = Object.assign({}, courses[0]);

          updatedCourse.title = 'Updated Course';
          updatedCourse.user = '57029ed4795118be119cc438';

          const expectedCourse = Object.assign({}, courses[0]);
          expectedCourse.title = 'Updated Course';

          const res = await request(app)
            .put(`/api/courses/${updatedCourse._id}`)
            .auth(testUser.emailAddress, testUser.password)
            .send(updatedCourse);

          res.statusCode.should.equal(204);
          res.body.should.be.empty;

          const res2 = await request(app)
            .get(`/api/courses/${updatedCourse._id}`);

          res2.statusCode.should.equal(200);
          res2.body.should.eql({ data: [expectedCourse] });
        });

        it('should return an error message if the supplied course ID isn\'t owned by the current user', async () => {
          const res = await request(app)
            .put('/api/courses/57029ed4795118be119cc442')
            .auth(testUser.emailAddress, testUser.password);

          res.statusCode.should.equal(403);
          res.body.should.eql({ message: 'Action only allowed on courses you own.' });
        });

        it('should return an error message when supplying an invalid course ID', async () => {
          const res = await request(app)
            .put('/api/courses/111122223333444455556666')
            .auth(testUser.emailAddress, testUser.password);

          res.statusCode.should.equal(404);
          res.body.should.eql({ message: 'Course not found for ID: 111122223333444455556666' });
        });
      });

      describe('DELETE request', () => {
        it('should require authentication', async () => {
          const res = await request(app)
            .delete('/api/courses/57029ed4795118be119cc440');

          res.statusCode.should.equal(401);
          res.body.should.eql({ message: 'Access Denied' });
        });

        it('should delete a course', async () => {
          const res = await request(app)
            .delete('/api/courses/57029ed4795118be119cc440')
            .auth(testUser.emailAddress, testUser.password);

          res.statusCode.should.equal(204);
          res.body.should.be.empty;

          const res2 = await request(app)
            .get('/api/courses/57029ed4795118be119cc440');

          res2.statusCode.should.equal(404);
        });

        it('should return an error message if the supplied course ID isn\'t owned by the current user', async () => {
          const res = await request(app)
            .delete('/api/courses/57029ed4795118be119cc442')
            .auth(testUser.emailAddress, testUser.password);

          res.statusCode.should.equal(403);
          res.body.should.eql({ message: 'Action only allowed on courses you own.' });
        });

        it('should return an error message when supplying an invalid course ID', async () => {
          const res = await request(app)
            .delete('/api/courses/111122223333444455556666')
            .auth(testUser.emailAddress, testUser.password);

          res.statusCode.should.equal(404);
          res.body.should.eql({ message: 'Course not found for ID: 111122223333444455556666' });
        });
      });
    });
  });

  describe('users endpoint', () => {
    beforeEach(async () => {
      await database.init();
    });

    describe('root route', () => {
      describe('GET request', () => {
        it('should require authentication', async () => {
          const res = await request(app).get('/api/users');
          expect(res.statusCode).to.equal(401);
          expect(res.body.message).to.equal('Access Denied');
        });

        it('should require valid credentials', async () => {
          const res = await request(app)
            .get('/api/users')
            .auth('bogus@info.com', 'password');
          expect(res.statusCode).to.equal(401);
          expect(res.body.message).to.equal('Access Denied');
        });

        it('should return the current user when valid credentials are provided', async () => {
          const res = await request(app)
            .get('/api/users')
            .auth(testUser.emailAddress, testUser.password);

          expect(res.statusCode).to.equal(200);

          const user = res.body.data[0];

          expect(user).to.not.be.null;
          expect(user.firstName).to.equal('Joe');
          expect(user.lastName).to.equal('Smith');
          expect(user.emailAddress).to.equal('joe@smith.com');
        });

        it('should not return the current user\'s password when valid credentials are provided', async () => {
          const res = await request(app)
            .get('/api/users')
            .auth(testUser.emailAddress, testUser.password);

          expect(res.statusCode).to.equal(200);

          const user = res.body.data[0];

          expect(user).to.not.be.null;
          expect(user.password).to.be.undefined;
        });
      });

      describe('POST request', () => {
        it('should create a new user', async () => {
          const res = await request(app)
            .post('/api/users')
            .send({
              firstName: 'John',
              lastName: 'Smith',
              emailAddress: 'john@smith.com',
              password: 'password',
            });

          expect(res.statusCode).to.equal(201);
          expect(res.body).to.be.empty;

          const res2 = await request(app)
            .get('/api/users')
            .auth('john@smith.com', 'password');

          expect(res2.statusCode).to.equal(200);

          const user = res2.body.data[0];

          expect(user).to.not.be.null;
          expect(user.firstName).to.equal('John');
          expect(user.lastName).to.equal('Smith');
          expect(user.emailAddress).to.equal('john@smith.com');
        });

        it('should return error messages when supplying incomplete data', async () => {
          const res = await request(app)
            .post('/api/users')
            .send({});

          res.statusCode.should.equal(400);
          res.body.should.not.be.empty;
          res.body.message.should.equal('Validation Failed');
          res.body.errors.should.eql([
            'Please provide a value for "First Name"',
            'Please provide a value for "Last Name"',
            'Please provide a value for "Email Address"',
            'Please provide a value for "Password"',
          ]);
        });
      });
    });
  });

  // after(() => process.exit());
});
