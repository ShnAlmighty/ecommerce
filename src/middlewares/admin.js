const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      throw new Error('Authentication required');
    }

    const admin_emails_str = process.env.ADMINS;
    const admin_emails = admin_emails_str.split(',').trim(e => e.trim());;
    if(!admin_emails.includes(user.email)){
      throw new Error('Unauthorized!')
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
};

module.exports = authenticateAdmin;
