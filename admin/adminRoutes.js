const express = require('express');
const {queryUser, queryLoaiGiay, queryTenHang, queryTenSanPham, AdminDashboard, AddProduct, AddQuantity, EditProduct, EditQuantity, EditOrder, DeleteProduct, DeleteQuantity, getUserRole, AddAction, AddActionQuantity, DeleteAction, DeleteActionQuantity, EditAction, EditActionQuantity, EditActionOrder} = require('./adminQueries');
const router = express.Router();
const jwt = require('jsonwebtoken');
async function checkAdminRole(req, res, next) {
  try {
      const authHeader = req.headers['authorization'];
      const userId = authHeader && authHeader.split(' ')[1]; // Tách 'Bearer' và token
      // console.log(userId);
      const role = await getUserRole(userId);
      console.log(role,'(hàm check admin role)');
      if (role !== 'admin') {
          return res.status(403).json({ error: 'Truy cập bị từ chối: Không có quyền admin' });
      }
      next();
  } catch (error) {
      res.status(500).json({ error: 'Lỗi xác thực vai trò người dùng' });
  }
}
router.get('/users', async (req, res) => {
  try {
      const users = await queryUser();
      res.json(users);
  } catch (error) {
      console.error('Lỗi truy vấn user:', error);
      res.status(500).json({ error: 'Lỗi truy vấn user' });
  }
});
router.get('/', async (req, res) => {
    try {
        const admin = await AdminDashboard();
        res.json(admin);
    } catch (error) {
        console.error('Lỗi truy vấn', error);
        res.status(500).json({ error: 'Lỗi truy vấn ' });
    }
});
router.get('/loai-giay', async (req, res) => {
  try {
      const LoaiGiay = await queryLoaiGiay();
      res.json(LoaiGiay);
  } catch (error) {
      console.error('Lỗi truy vấn loại giày:', error);
      res.status(500).json({ error: 'Lỗi truy vấn loại giày' });
  }
});
router.get('/ten-hang', async (req, res) => {
  try {
      const TenHang = await queryTenHang();
      res.json(TenHang);
  } catch (error) {
      console.error('Lỗi truy vấn hãng:', error);
      res.status(500).json({ error: 'Lỗi truy vấn hãng' });
  }
});
router.get('/san-pham', async (req, res) => {
  try {
      const TenSanPham = await queryTenSanPham();
      res.json(TenSanPham);
  } catch (error) {
      console.error('Lỗi truy vấn tên sản phẩm:', error);
      res.status(500).json({ error: 'Lỗi truy vấn tên sản phẩm' });
  }
});
router.post('/product', checkAdminRole, async (req, res) => {
    const {TenSanPham,MoTa,Gia,AnhBia,LoaiGiay,TenHang,MauSac } = req.body;
    
    try {
      const result = await AddProduct(TenSanPham,MoTa,Gia,AnhBia,LoaiGiay,TenHang,MauSac);
      // Giải mã username từ header
      const encodedUsername = req.headers['username'];
      const TenKhachHang = decodeURIComponent(encodedUsername);
      await AddAction(TenKhachHang,TenSanPham);
      // console.log(username);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm sản phẩm.' });
    }
  });
router.post('/quantity', checkAdminRole, async (req, res) => {
    const {TenSanPham, KichThuoc, SoLuong } = req.body;
    
    try {
      const result = await AddQuantity(TenSanPham, KichThuoc, SoLuong);
      // Giải mã username từ header
      const encodedUsername = req.headers['username'];
      const TenKhachHang = decodeURIComponent(encodedUsername);
      await AddActionQuantity(TenKhachHang,TenSanPham);
      // console.log(username);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm số lượng sản phẩm.' });
    }
  });
router.put('/product/:SanPhamID',checkAdminRole, async (req, res) => {
    const { SanPhamID } = req.params;
    const { TenSanPham,MoTa,Gia,AnhBia,LoaiGiay,TenHang,MauSac } = req.body;

    try {
      const result = await EditProduct(SanPhamID,TenSanPham,MoTa,Gia,AnhBia,LoaiGiay,TenHang,MauSac);
      // Giải mã username từ header
      const encodedUsername = req.headers['username'];
      const TenKhachHang = decodeURIComponent(encodedUsername);
      await EditAction(TenKhachHang,TenSanPham);
      res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật sản phẩm.' });
    }
});
router.put('/quantity/:Id',checkAdminRole, async (req, res) => {
  const { Id } = req.params;
  const { TenSanPham, KichThuoc, SoLuong } = req.body;

  try {
    const result = await EditQuantity(Id, TenSanPham, KichThuoc, SoLuong);
    // Giải mã username từ header
    const encodedUsername = req.headers['username'];
    const TenKhachHang = decodeURIComponent(encodedUsername);
    await EditActionQuantity(TenKhachHang,TenSanPham);
    res.status(200).json(result);
  } catch (error) {
      res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật số lượng sản phẩm.' });
  }
});
router.put('/order/:Id',checkAdminRole, async (req, res) => {
  const { Id } = req.params;
  const { trangThai, diaChi, ngayGiao } = req.body;

  try {
    const result = await EditOrder(Id, trangThai, diaChi, ngayGiao);
    // Giải mã username từ header
    const encodedUsername = req.headers['username'];
    const TenKhachHang = decodeURIComponent(encodedUsername);
    await EditActionOrder(TenKhachHang,Id);
    res.status(200).json(result);
  } catch (error) {
      res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật đơn hàng.' });
  }
});
router.post('/delete-item', checkAdminRole, async(req, res) => {
  const {SanPhamID, TenSanPham} = req.body;
  try{
    const result = await DeleteProduct(SanPhamID);
    // Giải mã username từ header
    const encodedUsername = req.headers['username'];
    const TenKhachHang = decodeURIComponent(encodedUsername);
    await DeleteAction(TenKhachHang,TenSanPham);
    res.status(201).json(result);
    console.log({result})
  } catch (error) {
    res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa sản phẩm.' });
    console.log(error)
  }
});
router.post('/delete-quantity', checkAdminRole, async(req, res) => {
  const {ID, TenSanPham} = req.body;
  try{
    const result = await DeleteQuantity(ID);
    // Giải mã username từ header
    const encodedUsername = req.headers['username'];
    const TenKhachHang = decodeURIComponent(encodedUsername);
    await DeleteActionQuantity(TenKhachHang,TenSanPham);
    res.status(201).json(result);
    console.log({result })
  } catch (error) {
    res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa số lượng sản phẩm.' });
    console.log(error)
  }
});
module.exports = router;