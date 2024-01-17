const superagent = require('superagent');
const { expect } = require('chai');
const mongoose = require('mongoose');
// const expect = chai.expect;

const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/user');

const server = `http://localhost:3005`;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB');
});

describe('Auth API Test Cases', () => {
  let token;

  it('should register a new user', async () => {
    const response = await superagent
        .post(`${server}/auth/signup`)
        .send({ email: 'newuser@example.com', password: 'securepassword' });

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('token');
    token = response.body.token;
  });

  it('should logout the user', async () => {
    const response = await superagent
        .post(`${server}/auth/logout`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).to.equal(200);
  });

  it('should reject registration with duplicate email', (done) => { 
      superagent
        .post(`${server}/auth/signup`)
        .send({ email: 'newuser@example.com', password: 'securepassword' })
        .then((res) => {})
        .catch((err) => {
          expect(err.response.statusCode).to.equal(400);
          done();
        });
  });

  it('should reject login with invalid credentials', async () => {
      superagent
        .post(`${server}/auth/login`)
        .send({ email: 'newuser@example.com', password: 'invalid' })
        .then((res) => {})
        .catch((err) => {
          expect(err.response.statusCode).to.equal(401);
          done();
        });
  });

  it('should login with valid credentials', async () => {
    const response = await superagent
        .post(`${server}/auth/login`)
        .send({ email: 'newuser@example.com', password: 'securepassword' });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
    token = response.body.token;
  });

  it('should logout the user from all sessions', async () => {
    const response = await superagent
        .post(`${server}/auth/logoutall`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).to.equal(200);
  });

  after(async() => {
    try{
      await User.deleteOne({ email: 'newuser@example.com' });
    } catch(err){
      console.error(err)
    }
  });
});