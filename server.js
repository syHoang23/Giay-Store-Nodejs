require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const productRoutes = require('./product/productRoutes');
const quantityRoutes = require('./quantity/quantityRoutes');
const userRoutes = require('./user/userRoutes');
const cartRoutes = require('./cart/cart_Routes');
const orderRoutes = require('./order/order_Routes');
const adminRoutes = require('./admin/adminRoutes');

app.use('/products', productRoutes);
app.use('/quantity', quantityRoutes);
app.use('/users', userRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);
app.use('/admin', adminRoutes);
app.get('*', (req, res) => {
    res.status(404).send('Không tìm thấy trang');
});
const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});
