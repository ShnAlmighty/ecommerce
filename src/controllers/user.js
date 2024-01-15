const User = require('../models/user');

const getUserInfo = async(req, res) => {
  try {
    const user = await User.findById(req.user._id).lean().select('-password -tokens._id');
    res.send({ user });
  } catch(error){
    res.status(400).send(error.message);
  }
};

const getCartDetails = async function (req, res) {
  try {
    const cart = req.user.cart || {};
    res.send({ cart });
  } catch(error){
    res.status(400).send(error.message);
  }
};

const addToCart = async function (req, res) {
  try {
    const { items } = req.body;
    const user = req.user;
    let cart = user.cart || {};

    for(let item of items){
      const { id, name, quantity, amount} = item;
      const total_amount = parseFloat((quantity * amount).toFixed(2));
      const itemObj = {
        name,
        quantity,
        amount,
        total_amount
      };
      cart = {
        ...cart,
        [id]: itemObj
      }
    };
    user.cart = cart;

    user.markModified('cart');
    await user.save();

    res.json({ cart });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Internal Server Error' });
  }
};

module.exports = { 
  getUserInfo,
  getCartDetails,
  addToCart
};
