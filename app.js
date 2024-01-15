const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./src/routes/auth');
const orderRoutes = require('./src/routes/order');
const userRoutes = require('./src/routes/user');
const adminRoutes = require('./src/routes/admin');
const itemRoutes = require('./src/routes/item');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.get('/', (req, res) => {
  res.send("Welcome to Ecommerce APIs");
})

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/items', itemRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
