/* eslint-env mocha */
process.env.NODE_ENV = 'test';
const mocks = require('node-mocks-http');
const assert = require('assert');
const { registration, login } = require('../controllers/authController');
const { addUser, deleteUser, truncateUsers } = require('../models/userModel');

describe('Test cases for parkspots API', async () => {
  before(async () => {
    let req = mocks.createRequest({
      method: 'POST',
      body: {
        email: 'admin@gmail.com',
        password: 'admin',
        name: 'Admin',
        lastname: 'Admin',
        role: 99,
      },
    });
    let res = mocks.createResponse();
    await addUser(req, res);

    req = mocks.createRequest({
      method: 'POST',
      body: {
        email: 'test1@gmail.com',
        password: 'user',
        name: 'user',
        lastname: 'user',
        role: 0,
      },
    });
    res = mocks.createResponse();
    await addUser(req, res);
  });

  after(async () => {
    await truncateUsers();
  });

  describe('Test api: REGISTRATION', async () => {
    it(`Given existed user email and password for user registration, 
    should return isExisted: true`, async () => {
      const req = mocks.createRequest({
        method: 'POST',
        url: '/registration',
        body: {
          email: 'test1@gmail.com',
          password: 'test1',
          name: 'test1',
          lastname: 'test1',
          role: 0,
        },
      });
      const res = mocks.createResponse();
      await registration(req, res);
      const data = res._getJSONData();
      assert.strictEqual(data.isExisted, true);
      assert.strictEqual(data.message, 'User already exists');
    });

    it('Given non-existed user email and password for user registration, should add new user into DB and return isExisted: false', async () => {
      const req = mocks.createRequest({
        method: 'POST',
        url: '/registration',
        body: {
          email: 'test2@gmail.com',
          password: 'test2',
          name: 'test2',
          lastname: 'test2',
          role: 0,
        },
      });
      const res = mocks.createResponse();
      await registration(req, res);
      const data = res._getJSONData();
      assert.strictEqual(data.isExisted, false);
      assert.strictEqual(data.message, 'User has been registered');
    });
  });

  describe('Test api: LOGIN', async () => {
    it('Given existed admin login and password for log in, should return isLogged: true', async () => {
      const req = mocks.createRequest({
        method: 'POST',
        url: '/login',
        body: {
          email: 'test1@gmail.com',
          password: 'user',
        },
      });
      const res = mocks.createResponse();
      await login(req, res);
      const data = res._getJSONData();
      console.log(`generated token: ${data.token}`);
      assert.strictEqual(data.isLogged, true);
    });

    it('Given existed admin login BUT incorrect password for log in, should return isLogged: true', async () => {
      const req = mocks.createRequest({
        method: 'POST',
        url: '/login',
        body: {
          email: 'test1@gmail.com',
          password: 'incorrectPasswd',
        },
      });
      const res = mocks.createResponse();
      await login(req, res);
      const data = res._getJSONData();
      assert.strictEqual(data.isLogged, false);
    });
  });
});
