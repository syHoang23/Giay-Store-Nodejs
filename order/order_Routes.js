const express = require('express');
const router = express.Router();
const { InsertOrder, queryOrder, queryOrderById, queryOrderAdminById, Order_Info, Delete, Update } = require('./order_Queries');
  router.get('/', async (req, res) => {
  try {
      const order = await queryOrder();
      res.json(order);
  } catch (error) {
      console.error('Lỗi truy vấn order:', error);
      res.status(500).json({ error: 'Lỗi truy vấn order' });
  }
  });
  router.post('/adds', async (req, res) => {
    const { KhachHangID, TongGiaTri, TrangThai, DiaChiGiaoHang, ChiTietDonHang } = req.body;
    
    try {
      const result = await InsertOrder( KhachHangID, TongGiaTri, TrangThai, DiaChiGiaoHang, ChiTietDonHang );
      res.status(201).json(result);
    } catch (error) {
      console.error('Error:', error);

      // Phân loại lỗi và trả về status 400 hoặc 500
        if (error.message && error.message.startsWith('Sản phẩm ID')) {
          // Lỗi do tồn kho không đủ
          res.status(400).json({ message: error.message });
      } else {
          // Lỗi khác
          res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm đơn hàng.' });
      }
    }
  });
  router.post('/order-info', async (req, res)=> {
    const {KhachHangID} = req.body;
    
    try {
      const order = await Order_Info(KhachHangID);
      res.json(order);
     
    } catch (error) {
        console.error('Lỗi truy vấn Order:', error);
        res.status(500).json({ error: 'Lỗi truy vấn order' });
    }
    
  }); 
  router.get('/:OrderID', async (req, res) => {
    const OrderID = req.params.OrderID;
    try {
        const order = await queryOrderById(OrderID);
        if (!order) {
            return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
        }
        res.json(order);
    } catch (error) {
        console.error(`Lỗi truy vấn đơn hàng ${OrderID}:`, error);
        res.status(500).json({ error: `Lỗi truy vấn đơn hàng ${OrderID}` });
    }
  });
  router.get('/ten-khach-hang/:OrderID', async (req, res) => {
    const OrderID = req.params.OrderID;
    try {
        const order = await queryOrderAdminById(OrderID);
        if (!order) {
            return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
        }
        res.json(order);
    } catch (error) {
        console.error(`Lỗi truy vấn đơn hàng ${OrderID}:`, error);
        res.status(500).json({ error: `Lỗi truy vấn đơn hàng: ${OrderID}` });
    }
  });
  router.post('/delete-order', async (req, res) => {
      const { DonHangID, KhachHangID } = req.body;
      try {
          const result = await Delete(DonHangID, KhachHangID);
          res.status(200).json(result); // Đổi mã trạng thái thành 200
      } catch (error) {
          res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa đơn hàng.' });
      }
  });
router.post('/cancel-order', async (req, res) => {
      const {OrderID} = req.body;
    try {
        const result = await Update(OrderID);
        res.status(200).json(result); // Đổi mã trạng thái thành 200
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi khi hủy đơn hàng.' });
    }
  });
  module.exports = router;