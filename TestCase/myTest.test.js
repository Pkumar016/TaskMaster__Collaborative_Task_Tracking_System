const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { expect } = chai;
const userService = require('./userService');
const taskService = require('./taskService');

chai.use(chaiHttp);

describe('User Service', () => {
  let createUserStub, getUserByUserEmailStub;

  beforeEach(() => {
    createUserStub = sinon.stub(userService, 'create');
    getUserByUserEmailStub = sinon.stub(userService, 'getUserByUserEmail');
  });

  afterEach(() => {
    createUserStub.restore();
    getUserByUserEmailStub.restore();
  });

  describe('createUser', () => {
    it('should create a new user', (done) => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        gender: 'male',
        email: 'john.doe@example.com',
        password: 'password123',
        number: '1234567890',
        preferences: { theme: 'dark' }
      };
      const expectedResult = { id: 1, ...user, role: 'attendee' };

      createUserStub.callsFake((data, callback) => {
        callback(null, expectedResult);
      });

      chai.request(userService)
        .post('/user')
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(1);
          expect(res.body.data).to.deep.equal(expectedResult);
          done();
        });
    });

    it('should handle errors when creating a user', (done) => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        gender: 'male',
        email: 'john.doe@example.com',
        password: 'password123',
        number: '1234567890',
        preferences: { theme: 'dark' }
      };
      const error = new Error('Database connection error');

      createUserStub.callsFake((data, callback) => {
        callback(error);
      });

      chai.request(userService)
        .post('/user')
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.success).to.equal(0);
          expect(res.body.message).to.equal(error.message);
          done();
        });
    });
  });

  describe('login', () => {
    it('should login a user', (done) => {
      const user = {
        email: 'john.doe@example.com',
        password: 'password123'
      };
      const databaseUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        gender: 'male',
        email: 'john.doe@example.com',
        password: '$2b$10$xJ0QjQ65BnUuxFZgZgJ68OT4Sy2Eex4Gh.yaiLLNo1x3aOcQ4clTu', // hashed password
        number: '1234567890',
        preferences: { theme: 'dark' },
        role: 'attendee'
      };
      const token = 'example_token';

      getUserByUserEmailStub.callsFake((email, callback) => {
        callback(null, databaseUser);
      });

      chai.request(userService)
        .post('/login')
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(1);
          expect(res.body.token).to.equal(token);
          done();
        });
    });

    it('should handle invalid email or password', (done) => {
      const user = {
        email: 'john.doe@example.com',
        password: 'wrongpassword'
      };
      const error = { message: 'Invalid email or password' };

      getUserByUserEmailStub.callsFake((email, callback) => {
        callback(null, null);
      });

      chai.request(userService)
        .post('/login')
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(0);
          expect(res.body.data).to.equal(error.message);
          done();
        });
    });

    it('should handle database errors during login', (done) => {
      const user = {
        email: 'john.doe@example.com',
        password: 'password123'
      };
      const error = new Error('Database connection error');

      getUserByUserEmailStub.callsFake((email, callback) => {
        callback(error);
      });

      chai.request(userService)
        .post('/login')
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.success).to.equal(0);
          expect(res.body.message).to.equal(error.message);
          done();
        });
    });
  });

  describe('createTask', () => {
    it('should create a new task', (done) => {
      const task = {
        title: 'Test Task',
        description: 'This is a test task',
        dueDate: '2024-04-28',
        assignedTo: 'John Doe'
      };
      const expectedResult = { id: 1, ...task };

      taskService.createTask.callsFake((title, description, dueDate, assignedTo) => {
        return expectedResult;
      });

      chai.request(userService)
        .post('/task')
        .send(task)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.message).to.equal('Task created successfully');
          expect(res.body.task).to.deep.equal(expectedResult);
          done();
        });
    });

    it('should handle errors when creating a task', (done) => {
      const task = {
        title: 'Test Task',
        description: 'This is a test task',
        dueDate: '2024-04-28',
        assignedTo: 'John Doe'
      };
      const error = new Error('Internal server error');

      taskService.createTask.callsFake((title, description, dueDate, assignedTo) => {
        throw error;
      });

      chai.request(userService)
        .post('/task')
        .send(task)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body.message).to.equal('Internal server error');
          done();
        });
    });
  });

});
