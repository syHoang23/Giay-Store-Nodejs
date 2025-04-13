const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');
async function initialize() {
    try {
      await oracledb.createPool({
        user: dbConfig.user,
        password: dbConfig.password,
        connectString: dbConfig.connectString
      });
      console.log('Connection pool created successfully.');
    } catch (err) {
      console.error('Error creating connection pool:', err);
    }
  }
  initialize()
  async function InsertCart( KhachHangID, SanPhamID, TenSanPham, SoLuong, Gia, KichThuoc, AnhBia) {
    let connection;
    try {
       
        connection = await oracledb.getConnection(dbConfig);      
        await connection.execute('INSERT INTO GioHang (KhachHangID, SanPhamID, TenSanPham, SoLuong, Gia, KichThuoc, AnhBia) VALUES (:KhachHangID, :SanPhamID, :TenSanPham, :SoLuong, :Gia, :KichThuoc, :AnhBia)', 
        {KhachHangID, SanPhamID, TenSanPham, SoLuong, Gia, KichThuoc, AnhBia});
    
        
          // Commit transaction
          await connection.commit();
      
          // Giải phóng kết nối
          await connection.close();
          return { message: 'Thêm sản phẩm thành công.' };
    } catch (error) {
        console.log('Lỗi khi thêm sản phẩm:', error);
        
        
    }
}
   async function Cart_Info(KhachHangID) {
      let connection;
      try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute('SELECT * FROM GioHang WHERE KhachHangID = :KhachHangID', [KhachHangID]);
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
async function Delete(KhachHangID, SanPhamID) {
    let connection; 
    try {
        connection = await oracledb.getConnection(dbConfig);

        // Thực hiện truy vấn xóa sản phẩm dựa trên Id
        const result = await connection.execute('DELETE FROM GioHang WHERE KhachHangID = :KhachHangID and SanPhamID = :SanPhamID', { KhachHangID, SanPhamID });
        await connection.commit(); // Cam kết giao dịch
        await connection.close(); // Đóng kết nối

        if (result.rowsAffected === 0) {
            return { message: 'Không tìm thấy sản phẩm để xóa.' };
        }
        return { message: 'Xóa sản phẩm thành công.' };

        // Kiểm tra số lượng hàng bị ảnh hưởng
      
    } catch (error) {
        console.log('Lỗi khi xóa sản phẩm:', error);
        // Có thể thêm xử lý lỗi khác tại đây, ví dụ: ghi log, báo lỗi, vv.
        return { message: 'Đã xảy ra lỗi khi xóa sản phẩm.' };
    }
}
async function DeleteAll(KhachHangID) {
    let connection; 
    try {
        connection = await oracledb.getConnection(dbConfig);

        // Thực hiện truy vấn xóa tất cả sản phẩm dựa trên Id
        const result = await connection.execute('DELETE FROM GioHang WHERE KhachHangID = :KhachHangID', { KhachHangID });
        await connection.commit(); // Cam kết giao dịch
        await connection.close(); // Đóng kết nối

        if (result.rowsAffected === 0) {
            return { message: 'Không tìm thấy sản phẩm để xóa.' };
        }
        return { message: 'Giỏ hàng của bạn đã được làm mới.' };

        // Kiểm tra số lượng hàng bị ảnh hưởng
      
    } catch (error) {
        console.log('Lỗi khi xóa sản phẩm:', error);
        // Có thể thêm xử lý lỗi khác tại đây, ví dụ: ghi log, báo lỗi, vv.
        return { message: 'Đã xảy ra lỗi khi xóa sản phẩm.' };
    }
}




module.exports = { InsertCart, Cart_Info, Delete, DeleteAll};