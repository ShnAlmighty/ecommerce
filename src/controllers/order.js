const Order = require('../models/order');

const getOrderInfo = async function (req, res) {
  try {
    const order = await Order.findById(req.params.id).lean();
    res.send({ order });
  } catch(error){
    res.status(400).send(error.message);
  }
};

const getOrders = async function (req, res) {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const orders = await Order.find({ orderBy: req.user._id })
    .sort('-created_at')
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
    res.send({ orders });
  } catch(error){
    res.status(400).send(error.message);
  }
};

const getOrdersCount = async function (req, res) {
  try {
    const count = await Order.countDocuments({ orderBy: req.user._id });
    res.send({ count });
  } catch(error){
    res.status(400).send(error.message);
  }
};

module.exports = { 
  getOrderInfo,
  getOrders,
  getOrdersCount,
};
