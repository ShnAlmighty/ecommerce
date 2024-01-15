const Order = require('../models/order');
const Discount = require('../models/discount');

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
    const orders = await Order.find({ orderByUser: req.user._id })
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
    const count = await Order.countDocuments({ orderByUser: req.user._id });
    res.send({ count });
  } catch(error){
    res.status(400).send(error.message);
  }
};

const checkout = async function(req, res) {
  try {
    const NTH_ORDER = process.env.NTH_ORDER;

    const user = req.user;
    const discount_code = req.body?.discount_code ?? null;
    let discount = 0;
    if(discount_code){
      const discountDoc = await Discount.findOne({ discountCode: discount_code }).lean();
      if(!discountDoc){
        throw new Error('Coupon Invalid!')
      }
      const totalOrders = await Order.find().countDocuments();
      if ((totalOrders % (NTH_ORDER - 1)) !== 0) {
        throw new Error("Coupon Invalid!")
      } 
      discount = 0.1;
    }
    const cart = user.cart;
    if(!cart || Object.keys(cart).length == 0){
      throw new Error('Cart is Empty');
    }
    let total_amount = 0;
    let total_items = 0;
    for(item_id in cart){
      const item = cart[item_id];
      total_amount = total_amount + item.total_amount;
      total_items = total_items + item.quantity;
    }
    const discount_amount = (total_amount * discount).toFixed(2);
    const billable_total_amount = (total_amount - discount_amount).toFixed(2);
    const orderObj = {
      totalAmount: total_amount,
      totalQuantity: total_items,
      discountAmount: discount_amount,
      billableAmount: billable_total_amount,
      items: cart,
      orderByUser: user._id,
      discountCode: discount_code
    }
    const order = new Order(orderObj);
    await order.save();
    
    //Logic for stripeAPIs, etc

    user.cart = null;
    user.markModified('cart');
    await user.save();
    // User.findByIdAndUpdate(user._id, { $unset: {'cart': 1 }});
    
    res.status(200).json({ total_amount, transaction: 'completed' })
  } catch(error) {
    res.status(400).send(error.message);
  }
}

module.exports = { 
  getOrderInfo,
  getOrders,
  getOrdersCount,
  checkout
};
