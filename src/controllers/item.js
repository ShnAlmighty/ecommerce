const Item = require('../models/item');
const { nanoid } = require('nanoid');

const fetchItemUtility = async function(item_id) {
  let itemDoc;
  try {
    itemDoc = await Item.findById(item_id);
    return itemDoc;
  } catch(err) {
    console.error(err.message);
    try {
      itemDoc = await Item.findOne({ item_id });
      return itemDoc;
    } catch(e){
      console.error(e.message);
      return null;
    }
  }
};

const getItemInfo = async(req, res) => {
  try {
    let item = await fetchItemUtility(req.params.id);
    if(!item){
      return res.status(404).send('Item not found');
    }
    res.send({ item });
  } catch(error){
    res.status(400).send(error.message);
  }
};

const getAllItems = async(req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const items = await Item.find({})
    .sort('-created_at')
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
    res.send({ items });
  } catch(error){
    res.status(400).send(error.message);
  }
};

const addItem = async function (req, res) {
  try {
    const { name=null, amount=null, quantity=null } = req.body;
    if(!name || !amount || !quantity){
      return res.status(400).send("Kindly provide all details of the item!");
    }
    const user = req.user;
    
    const item_id = `Item_${nanoid(5)}`;
    const itemObj = {
      item_id,
      name,
      owner: user._id,
      amount,
      quantity
    }
    const item = new Item(itemObj);
    await item.save();
    res.status(201).send("Item added successfully");
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Internal Server Error' });
  }
};

const updateItem = async function (req, res) {
  try {
    const { name=null, amount=null, quantity=null } = req.body;    
    let item = await fetchItemUtility(req.params.id);
    if(!item){
      return res.status(404).send('Item not found');
    }

    item.name = name ? name : item.name;
    item.amount = amount ? amount : item.amount;
    item.quantity = quantity ? quantity : item.quantity;
    await item.save();
    res.status(200).json({item: item.toJSON()});
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Internal Server Error' });
  }
};

const removeItem = async(req, res) => {
  try {
    let item = await fetchItemUtility(req.params.id);
    if(!item){
      return res.status(404).send('Item not found');
    };
    await item.deleteOne();
    const item_temp = await Item.findOne({ item_id: item.item_id });
    console.log({item_temp})
    res.json({ item });
  } catch(error){
    res.status(400).send(error.message);
  }
};

module.exports = { 
  getAllItems,
  getItemInfo,
  addItem,
  updateItem,
  removeItem,
  fetchItemUtility
};
