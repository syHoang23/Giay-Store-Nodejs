const express = require('express');
const router = express.Router();
const { InsertCart, Cart_Info, Delete, DeleteAll } = require('./cart_Queries');
router.post('/adds', async (req, res) => {
    const { KhachHangID, SanPhamID, TenSanPham, SoLuong, Gia, KichThuoc, AnhBia } = req.body;
    
    try {
      const result = await InsertCart( KhachHangID, SanPhamID, TenSanPham, SoLuong, Gia, KichThuoc, AnhBia );
      res.status(201).json(result);
    } catch (error) {
     
        res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm sản phẩm' });
      
    }
  });
  router.post('/cart-info', async (req, res)=> {
    const {KhachHangID} = req.body;
    
    try {
      const cart = await Cart_Info(KhachHangID);
      res.json(cart);
     
    } catch (error) {
        console.error('Lỗi truy vấn Cart:', error);
        res.status(500).json({ error: 'Lỗi truy vấn cart' });
    }
    
  }); 

  router.post('/delete-item', async (req, res) => {
    const { KhachHangID, SanPhamID } = req.body;
    try {
        const result = await Delete(KhachHangID, SanPhamID);
        res.status(200).json(result); // Đổi mã trạng thái thành 200
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa sản phẩm.' });
    }
  });
  router.post('/delete-all-item', async (req, res) => {
    const { KhachHangID } = req.body;
    try {
        const result = await DeleteAll(KhachHangID);
        res.status(200).json(result); // Đổi mã trạng thái thành 200
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa tất cả sản phẩm.' });
    }
  });
  module.exports = router;