const express = require('express');
const router = express.Router();
const { queryProduct1, queryProductById, queryProductTonKhoById } = require('./productQueries');

router.get('/', async (req, res) => {
    try {
        const products = await queryProduct1();
        res.json(products);
    } catch (error) {
        console.error('Lỗi truy vấn product1:', error);
        res.status(500).json({ error: 'Lỗi truy vấn product1' });
    }
});

router.get('/:SanPhamID', async (req, res) => {
    const SanPhamID = req.params.SanPhamID;
    try {
        const product = await queryProductById(SanPhamID);
        if (!product) {
            return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
        }
        res.json(product);
    } catch (error) {
        console.error(`Lỗi truy vấn sản phẩm ${SanPhamID}:`, error);
        res.status(500).json({ error: `Lỗi truy vấn sản phẩm ${SanPhamID}` });
    }
});
router.get('/tonkho/:SanPhamID', async (req, res) => {
    const SanPhamID = req.params.SanPhamID;
    try {
        const product = await queryProductTonKhoById(SanPhamID);
        if (!product) {
            return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
        }
        res.json(product);
    } catch (error) {
        console.error(`Lỗi truy vấn sản phẩm ${SanPhamID}:`, error);
        res.status(500).json({ error: `Lỗi truy vấn sản phẩm ${SanPhamID}` });
    }
});

module.exports = router;
