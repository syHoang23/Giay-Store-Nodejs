const express = require('express');
const router = express.Router();
const { queryQuantity, queryQuantityById } = require('./quantityQueries');
router.get('/', async (req, res) => {
    try {
        const quantity = await queryQuantity();
        res.json(quantity);
    } catch (error) {
        console.error('Lỗi truy vấn quantity:', error);
        res.status(500).json({ error: 'Lỗi truy vấn quantity' });
    }
});
router.get('/:ID', async (req, res) => {
    const ID = req.params.ID;
    try {
        const quantity = await queryQuantityById(ID);
        if (!quantity) {
            return res.status(404).json({ error: 'Không tìm thấy số lượng của sản phẩm' });
        }
        res.json(quantity);
    } catch (error) {
        console.error(`Lỗi truy vấn số lượng sản phẩm ${ID}:`, error);
        res.status(500).json({ error: `Lỗi truy vấn số lượng sản phẩm ${ID}` });
    }
});

module.exports = router;
