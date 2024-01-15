const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin_emails_str = process.env.ADMINS;
    const admin_emails = admin_emails_str.split(',');

    const admin = !!(admin_emails.includes(email));
    const user = new User({ email, password: hashedPassword, admin });
    await user.save();

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();

    res.status(201).send({ token });
  } catch (error) {
    console.log("Error in signup: ", error);
    res.status(400).send(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('Invalid login credentials');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new Error('Invalid login credentials');
    }

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();

    res.send({ user, token });
  } catch (error) {
    res.status(401).send(error.message);
  }
};

const logout = async (req,res)=>{
  try{
      req.user.tokens = req.user.tokens.filter((token)=>{
          return token.token!==req.token;
      });
      await req.user.save();

      res.send();
  }catch(e){
      res.status(500).send();
  }
};

const logoutall = async (req,res)=>{
  try{
      req.user.tokens = [];
      await req.user.save();

      res.send();
  }catch(e){
      res.status(500).send();
  }
}

module.exports = { 
  signup, 
  login,
  logout,
  logoutall 
};
