const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');

async function queryProduct1() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute('SELECT SP.SanPhamID, SP.TenSanPham, SP.Mota, SP.Gia, SP.AnhBia, LG.TenLoai, HG.TenHang, SP.MauSac FROM SanPham SP, LoaiGiay LG, Hang HG WHERE SP.HangID = HG.HangID and SP.LoaiGiayID = LG.LoaiGiayID ORDER BY SP.TenSanPham ASC');
        return result.rows;
    } catch (error) {
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error('Lỗi khi đóng kết nối:', error);
            }
        }
    }
}

async function queryProductById(SanPhamID) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute('SELECT SP.SanPhamID, SP.TenSanPham, SP.Mota, SP.Gia, SP.AnhBia, LG.TenLoai, HG.TenHang, SP.MauSac FROM SanPham SP, LoaiGiay LG, Hang HG WHERE SP.HangID = HG.HangID and SP.LoaiGiayID = LG.LoaiGiayID and SP.SanPhamID = :SanPhamID', [SanPhamID]);
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error('Lỗi khi đóng kết nối:', error);
            }
        }
    }
}
async function queryProductTonKhoById(SanPhamID) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute('SELECT KichThuoc,SoLuong from TonKho where SanPhamID = :SanPhamID ORDER BY KichThuoc ASC', [SanPhamID]);
        return result.rows;
    } catch (error) {
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error('Lỗi khi đóng kết nối:', error);
            }
        }
    }
}

module.exports = { queryProduct1, queryProductById, queryProductTonKhoById };
