const User = require('../models/user');
const Item = require('../models/item');

const itemController = require('./item');

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

const fetchItem = async function(item_id) {
  try {
    const itemDoc = await Item.findOne({ item_id });
    return itemDoc;
  } catch(err) {
    console.error(err.message);
    return null;
  }
};

const addToCart = async function (req, res) {
  try {
    const { items } = req.body;
    const user = req.user;
    let cart = user.cart || {};

    for(let item of items){
      const { item_id=null, quantity } = item;

      const itemDoc = await itemController.fetchItemUtility(item_id);
      if(!itemDoc){
        return res.status(404).send(`Following item not found: ${item_id}`);
      }

      const item_name = itemDoc.name;
      const item_quantity = itemDoc.quantity;
      if(quantity > item_quantity){
        return res.status(400).send(`Error: quantity for item ${item_id} exceeds existing stock`);
      }

      itemDoc.quantity = item_quantity - quantity;
      await itemDoc.save();

      const item_amount = itemDoc.amount;
      const total_amount = parseFloat((quantity * item_amount).toFixed(2));
      const itemObj = {
        name: item_name,
        quantity,
        amount: item_amount,
        total_amount
      };
      cart = {
        ...cart,
        [item_id]: itemObj
      }
    };

    const updatedUser = await User.findOneAndUpdate({ email: user.email }, { "$set": { cart } }, { new: true })

    res.json({ cart: updatedUser.cart });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Internal Server Error' });
  }
};

const removeFromCart = async function (req, res) {
  try {
    const user = req.user;
    let cart = user.cart || {};

    const itemDoc = await itemController.fetchItemUtility(req.params.id);
    if(!itemDoc){
      return res.status(404).send(`Following item not found: ${req.params.id}`);
    }
    const item_id = itemDoc.item_id;

    const cart_item = cart[item_id];
    if(!cart_item){
      return res.status(404).send(`Item not found in the cart`);
    }
    const cart_item_key = `cart.${itemDoc.item_id}`;
    const userUpdated = await User.findOneAndUpdate({ email: user.email }, { "$unset": { [cart_item_key]: "" } }, { new: true });

    const cart_item_quantity = cart_item.quantity;
    itemDoc.quantity = itemDoc.quantity + cart_item_quantity;
    await itemDoc.save();

    res.json({ cart: userUpdated.cart });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Internal Server Error' });
  }
};

module.exports = { 
  getUserInfo,
  getCartDetails,
  addToCart,
  removeFromCart
};
