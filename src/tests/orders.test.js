const superagent = require('superagent');
const { expect } = require('chai');
const mongoose = require('mongoose');
// const expect = chai.expect;

const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/user');
const Item = require('../models/item');
const Order = require('../models/order');

const server = `http://localhost:3005`;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB');
});

describe('Orders API Test Cases', () => {
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

  it('should add the item in the cart', async () => {
    const item_qty_to_be_added = 8;
    const response = await superagent
        .post(`${server}/user/add-to-cart`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          items:[{
          "item_id": item.item_id,
          "quantity": item_qty_to_be_added,
        }]});

    expect(response.status).to.equal(200);
    user = await User.findById(user._id);
    const cart = user.cart || {};
    expect(Object.keys(cart).length).to.equal(1);
    expect(Object.keys(cart)[0]).to.equal(item.item_id);
    const qty_before = item.quantity;
    item = await Item.findById(item._id);
    expect(item.quantity).to.equal((qty_before-item_qty_to_be_added));
  });

  it('should remove added item from cart', async () => {
    const item_qty_to_be_removed = user.cart[item.item_id].quantity;
    const response = await superagent
      .delete(`${server}/user/remove-from-cart/${item.item_id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
    console.log(response)
    user = await User.findById(user._id);
    expect(Object.keys(user.cart).length).to.equal(0);
    const qty_before = item.quantity;
    item = await Item.findById(item._id);
    expect(item.quantity).to.equal((qty_before+item_qty_to_be_removed));
  });

  it('should not be able to checkout with empty cart', (done) => { 
    superagent
        .post(`${server}/orders/checkout`)
        .set('Authorization', `Bearer ${token}`)
      .then((res) => {})
      .catch((err) => {
        expect(err.response.status).to.equal(400);
        done();
      });
  });

  it('should add the item in the cart again', async () => {
    const item_qty_to_be_added = 5;
    const response = await superagent
        .post(`${server}/user/add-to-cart`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          items:[{
          "item_id": item.item_id,
          "quantity": item_qty_to_be_added,
        }]});

    expect(response.status).to.equal(200);
    user = await User.findById(user._id);
    const cart = user.cart || {};
    expect(Object.keys(cart).length).to.equal(1);
    expect(Object.keys(cart)[0]).to.equal(item.item_id);
    const qty_before = item.quantity;
    item = await Item.findById(item._id);
    expect(item.quantity).to.equal((qty_before-item_qty_to_be_added));
  });


  it('should not be able to checkout with coupon that it not present', (done) => { 
    superagent
        .post(`${server}/orders/checkout`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          discount_code: 'wrong_code'
        })
      .then((res) => {})
      .catch((err) => {
        expect(err.response.status).to.equal(400);
        done();
      });
  });

  it('should be able to checkout', async () => {
    const response = await superagent
        .post(`${server}/orders/checkout`)
        .set('Authorization', `Bearer ${token}`)

    expect(response.status).to.equal(200);
    user = await User.findById(user._id);
    const cart = user.cart || {};
    expect(Object.keys(cart).length).to.equal(0);
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
      await Item.deleteMany({ owner: user._id });
      await Order.deleteMany({ orderByUser: user._id });
    } catch(err){
      console.error(err);
    }
  });
});