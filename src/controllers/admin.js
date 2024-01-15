const { nanoid } = require('nanoid');

const User = require('../models/user');
const Order = require('../models/order');
const Discount = require('../models/discount');

const generateDiscount = async function(req, res) {
  try {
    const discountCode = `Uniblox_${nanoid(10)}`;
    const discount = new Discount({ discountCode, createdBy: req.user._id });
    await discount.save();
    res.json({ message: 'Discount code generated successfully', discountCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const orderDetails = async function(req, res) {
  try {
    const ordersDetails = await Order.aggregate([
      {
        '$group': {
          '_id': null, 
          'totalItems': {
            '$sum': '$totalQuantity'
          }, 
          'totalAmount': {
            '$sum': '$totalAmount'
          }, 
          'totalDiscount': {
            '$sum': '$discountAmount'
          }
        }
      }
    ]);
    const discount_codes = await Discount.find({}).select('discountCode -_id').lean();
    const orders_details = {
      total_items: ordersDetails[0].totalItems,
      total_amount: ordersDetails[0].totalAmount,
      total_discounted_amount: ordersDetails[0].totalDiscount,
      discount_codes
    };
    res.json({ orders_details});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  generateDiscount,
  orderDetails
}