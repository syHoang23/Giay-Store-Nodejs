const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');
async function queryUser() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute('SELECT * FROM KhachHang');
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
async function AdminDashboard() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const customersResult = await connection.execute('SELECT COUNT(*) AS total_customers FROM KhachHang');
        const productsResult = await connection.execute('SELECT COUNT(*) AS total_products FROM SanPham');
        const recentActivitiesResult = await connection.execute('SELECT TenKhachHang, Action, Created_at FROM LichSu ORDER BY LichSuID DESC FETCH FIRST 100 ROWS ONLY');
        const recentActivities = recentActivitiesResult.rows.map(row => ({
            create_at: row[2],
            userName: row[0],
            action: row[1]
        }));
        return {           
                totalCustomers: customersResult.rows[0][0],
                totalProducts: productsResult.rows[0][0],
                recentAction: recentActivities         
        }
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
async function AddProduct(TenSanPham,MoTa,Gia,AnhBia,LoaiGiay,TenHang,MauSac) {
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      await connection.execute('INSERT INTO SanPham (TenSanPham,MoTa,Gia,AnhBia,LoaiGiayID,HangID,MauSac) VALUES (:TenSanPham,:MoTa,:Gia,:AnhBia,(SELECT LoaiGiayID FROM LoaiGiay WHERE TenLoai = :LoaiGiay),(SELECT HangID FROM Hang WHERE TenHang = :TenHang),:MauSac)', 
        {TenSanPham,MoTa,Gia,AnhBia,LoaiGiay,TenHang,MauSac});
      await connection.commit();
    
      // Giải phóng kết nối
      await connection.close();
    
      return { message: 'Sản phẩm đã được thêm thành công.' };
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      throw error;
    }
}
async function AddQuantity(TenSanPham, KichThuoc, SoLuong) {
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      await connection.execute('INSERT INTO TonKho (SanPhamID, KichThuoc, SoLuong) VALUES ((SELECT SanPhamID FROM SanPham WHERE TenSanPham = :TenSanPham), :KichThuoc, :SoLuong)', 
        {TenSanPham, KichThuoc, SoLuong});
      await connection.commit();
    
      // Giải phóng kết nối
      await connection.close();
    
      return { message: 'Sản phẩm đã được thêm thành công.' };
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      throw error;
    }
}
async function DeleteAction(TenKhachHang,TenSanPham) {
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      await connection.execute('INSERT INTO LichSu (TenKhachHang,Action) VALUES (:TenKhachHang,\' đã xoá \'||:TenSanPham)', 
        {TenKhachHang,TenSanPham});
      await connection.commit();
    
      // Giải phóng kết nối
      await connection.close();
    
      return { message: 'Lịch sử được thêm thành công.' };
    } catch (error) {
      console.error('Lỗi khi thêm lịch sử:', error);
      throw error;
    }
}
async function DeleteActionQuantity(TenKhachHang,TenSanPham) {
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      await connection.execute('INSERT INTO LichSu (TenKhachHang,Action) VALUES (:TenKhachHang,\' đã xoá số lượng sản phẩm \'||:TenSanPham)', 
        {TenKhachHang,TenSanPham});
      await connection.commit();
    
      // Giải phóng kết nối
      await connection.close();
    
      return { message: 'Lịch sử được thêm thành công.' };
    } catch (error) {
      console.error('Lỗi khi thêm lịch sử:', error);
      throw error;
    }
}
async function AddAction(TenKhachHang,TenSanPham) {
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      await connection.execute('INSERT INTO LichSu (TenKhachHang,Action) VALUES (:TenKhachHang,\' đã thêm \'||:TenSanPham)', 
        {TenKhachHang,TenSanPham});
      await connection.commit();
    
      // Giải phóng kết nối
      await connection.close();
    
      return { message: 'Lịch sử được thêm thành công.' };
    } catch (error) {
      console.error('Lỗi khi thêm lịch sử:', error);
      throw error;
    }
}
async function AddActionQuantity(TenKhachHang,TenSanPham) {
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      await connection.execute('INSERT INTO LichSu (TenKhachHang,Action) VALUES (:TenKhachHang,\' đã thêm số lượng sản phẩm \'||:TenSanPham)', 
        {TenKhachHang,TenSanPham});
      await connection.commit();
    
      // Giải phóng kết nối
      await connection.close();
    
      return { message: 'Lịch sử được thêm thành công.' };
    } catch (error) {
      console.error('Lỗi khi thêm lịch sử:', error);
      throw error;
    }
}
async function EditAction(TenKhachHang,TenSanPham) {
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      await connection.execute('INSERT INTO LichSu (TenKhachHang,Action) VALUES (:TenKhachHang,\' đã chỉnh sửa \'||:TenSanPham)', 
        {TenKhachHang,TenSanPham});
      await connection.commit();
    
      // Giải phóng kết nối
      await connection.close();
    
      return { message: 'Lịch sử được thêm thành công.' };
    } catch (error) {
      console.error('Lỗi khi thêm lịch sử:', error);
      throw error;
    }
}
async function EditActionQuantity(TenKhachHang,TenSanPham) {
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      await connection.execute('INSERT INTO LichSu (TenKhachHang,Action) VALUES (:TenKhachHang,\' đã chỉnh sửa số lượng sản phẩm \'||:TenSanPham)', 
        {TenKhachHang,TenSanPham});
      await connection.commit();
    
      // Giải phóng kết nối
      await connection.close();
    
      return { message: 'Lịch sử được thêm thành công.' };
    } catch (error) {
      console.error('Lỗi khi thêm lịch sử:', error);
      throw error;
    }
}
async function EditActionOrder(TenKhachHang,Id) {
    let connection;
    try {
      connection = await oracledb.getConnection(dbConfig);
      await connection.execute('INSERT INTO LichSu (TenKhachHang,Action) VALUES (:TenKhachHang,\' đã chỉnh sửa đơn hàng có Id: \'||:Id)', 
        {TenKhachHang,Id});
      await connection.commit();
    
      // Giải phóng kết nối
      await connection.close();
    
      return { message: 'Lịch sử được thêm thành công.' };
    } catch (error) {
      console.error('Lỗi khi thêm lịch sử:', error);
      throw error;
    }
}
async function EditProduct(SanPhamID,TenSanPham,MoTa,Gia,AnhBia,LoaiGiay,TenHang,MauSac) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        await connection.execute(
               `UPDATE SanPham
                SET TenSanPham = :TenSanPham,
                    MoTa = :MoTa,
                    Gia = :Gia,
                    AnhBia = :AnhBia, 
                    LoaiGiayID = (SELECT LoaiGiayID FROM LoaiGiay WHERE TenLoai = :LoaiGiay),
                    HangID = (SELECT HangID FROM Hang WHERE TenHang = :TenHang),
                    MauSac = :MauSac
                WHERE SanPhamID = :SanPhamID`, 
            { SanPhamID,TenSanPham,MoTa,Gia,AnhBia,LoaiGiay,TenHang,MauSac }
        );
        await connection.commit();

        // Giải phóng kết nối
        await connection.close();

        return { message: 'Sản phẩm đã được cập nhật thành công.' };
    } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm:', error);
        throw error;
    }
}
async function EditQuantity(Id, TenSanPham, KichThuoc, SoLuong) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        await connection.execute(
               `UPDATE TonKho
                SET SanPhamID = (SELECT SanPhamID FROM SanPham WHERE TenSanPham = :TenSanPham),
                    KichThuoc = :KichThuoc,
                    SoLuong = :SoLuong
                WHERE ID = :Id`, 
            { Id, TenSanPham, KichThuoc, SoLuong }
        );
        await connection.commit();

        // Giải phóng kết nối
        await connection.close();

        return { message: 'Sản phẩm đã được cập nhật thành công.' };
    } catch (error) {
        console.error('Lỗi khi cập nhật số lượng sản phẩm:', error);
        throw error;
    }
}
async function EditOrder(Id, trangThai, diaChi, ngayGiao) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        await connection.execute(
               `UPDATE DonHang
                SET TrangThai = :trangThai,
                    DiaChiGiaoHang = :diaChi,
                    NgayGiaoHang = TO_DATE(:ngayGiao, 'DD-MM-YYYY')
                WHERE DonHangID = :Id`,
            { Id, trangThai, diaChi, ngayGiao }
        );
        await connection.commit();

        // Giải phóng kết nối
        await connection.close();

        return { message: 'Đơn hàng đã được cập nhật thành công.' };
    } catch (error) {
        console.error('Lỗi khi cập nhật đơn hàng:', error);
        throw error;
    }
}
async function queryLoaiGiay() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute('SELECT * FROM LoaiGiay');
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
async function queryTenHang() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute('SELECT * FROM Hang');
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
async function queryTenSanPham() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute('SELECT SanPhamID,TenSanPham FROM SanPham');
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
async function DeleteProduct(SanPhamID) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        // Thực hiện truy vấn xóa sản phẩm dựa trên cartId
        const result = await connection.execute('DELETE FROM SanPham WHERE SanPhamID = :SanPhamID', [SanPhamID]);
        await connection.commit(); // Commit transaction
        await connection.close(); // Đóng kết nối
        return { message: 'Xóa sản phẩm thành công.' };

        // Kiểm tra số lượng hàng bị ảnh hưởng
      
    } catch (error) {
        console.log('Lỗi khi xóa sản phẩm:', error);
        // Có thể thêm xử lý lỗi khác tại đây, ví dụ: ghi log, báo lỗi, vv.
        return { message: 'Đã xảy ra lỗi khi xóa sản phẩm.' };
    }
}
async function DeleteQuantity(ID) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        // Thực hiện truy vấn xóa sản phẩm dựa trên cartId
        const result = await connection.execute('DELETE FROM TonKho WHERE ID = :ID', [ID]);
        await connection.commit(); // Commit transaction
        await connection.close(); // Đóng kết nối
        return { message: 'Xóa số lượng sản phẩm thành công.' };

        // Kiểm tra số lượng hàng bị ảnh hưởng
      
    } catch (error) {
        console.log('Lỗi khi xóa số lượng sản phẩm:', error);
        // Có thể thêm xử lý lỗi khác tại đây, ví dụ: ghi log, báo lỗi, vv.
        return { message: 'Đã xảy ra lỗi khi xóa số lượng sản phẩm.' };
    }
}
// Chức năng kiểm tra role người dùng
async function getUserRole(KhachHangID) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            'SELECT Role FROM KhachHang WHERE KhachHangID = :KhachHangID',
            { KhachHangID } // Sử dụng object với property tương ứng với tên tham số
        );

        if (result.rows.length > 0) {
            return result.rows[0][0]; // Trả về role (cột đầu tiên của dòng đầu tiên)
        } else {
            throw new Error('Người dùng không tồn tại');
        }
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
module.exports = {queryUser, queryLoaiGiay, queryTenHang, queryTenSanPham, AdminDashboard, AddProduct, AddQuantity, EditProduct, EditQuantity, EditOrder, DeleteProduct, DeleteQuantity, getUserRole, AddAction, AddActionQuantity, DeleteAction, DeleteActionQuantity, EditAction, EditActionQuantity, EditActionOrder};