const User = require('../models/user');

const getUserInfo = async(req, res) => {
  try {
    const user = await User.findById(req.user._id).lean().select('-password -tokens._id');
    res.send({ user });
  } catch(error){
    res.status(400).send(error.message);
  }
}

module.exports = { 
  getUserInfo
};
