const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');

async function queryQuantity() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute('SELECT tk.id, tk.sanphamid, sp.tensanpham, tk.kichthuoc, tk.soluong from tonkho tk, sanpham sp where tk.sanphamid = sp.sanphamid ORDER BY sp.tensanpham ASC, tk.KichThuoc ASC');
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

async function queryQuantityById(ID) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute('SELECT tk.id, tk.sanphamid, sp.tensanpham, tk.kichthuoc, tk.soluong from tonkho tk, sanpham sp where tk.sanphamid = sp.sanphamid and tk.ID=:ID', [ID]);
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

module.exports = { queryQuantity, queryQuantityById };
