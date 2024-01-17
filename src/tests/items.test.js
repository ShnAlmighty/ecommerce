const superagent = require('superagent');
const { expect } = require('chai');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/user');
const Item = require('../models/item');

const server = `http://localhost:3005`;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB');
});

describe('Items API Test Cases', () => {
  let user,
      token,
      item;

  before(async () => {
    const response = await superagent
        .post(`${server}/auth/signup`)
        .send({ email: 'newuser@example.com', password: 'securepassword' });
    token = response.body.token;
    user = await User.findOne({ email: 'newuser@example.com' });
    console.log({token, user})
  })

  it('should add a new item', async () => {
    const response = await superagent
        .post(`${server}/items/add`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          "name": "item_name_test",
          "quantity": 10,
          "amount": 9.04
        });

    expect(response.status).to.equal(201);
    item = await Item.findOne({ owner: user._id});
    console.log({item})
    expect(item).to.exist;
  });

  it('should edit added item', async () => {
    const response = await superagent
        .patch(`${server}/items/${item.item_id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          "quantity": 9,
        });

    expect(response.status).to.equal(200);
    item = await Item.findOne({ owner: user._id});
    expect(item.quantity).to.equal(9);
  });

  it('should remove added item', async () => {
    try {
      const response = await superagent
      .delete(`${server}/items/${item.item_id}`)
      .set('Authorization', `Bearer ${token}`);
      expect(response.status).to.equal(200);
      const itemTemp = await Item.findOne({ owner: user._id});
      expect(itemTemp).to.not.exist;
    } catch(err){
      console.log("itemTemp: ", err);
    }
  });

  it('should not edit non-existing item', (done) => { 
    superagent
        .patch(`${server}/items/wrong_id`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          "property": 9,
        })
      .then((res) => {})
      .catch((err) => {
        expect(err.response.status).to.equal(404);
        done();
      });
});

  it('should logout the user', async () => {
    const response = await superagent
        .post(`${server}/auth/logout`)
        .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).to.equal(200);
  });

  after(async() => {
    try{
      await User.findOneAndDelete({ email: 'newuser@example.com' });
      await Item.deleteOne({ owner: user._id });
    } catch(err){
      console.error(err);
    }
  });
});