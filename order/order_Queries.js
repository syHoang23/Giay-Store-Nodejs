const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');

async function queryOrder() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(`SELECT DH.DonHangID, 
                                                    KH.TenKhachHang, 
                                                    DH.NgayDatHang, 
                                                    DH.TongGiaTri, 
                                                    DH.TrangThai, 
                                                    DH.DiaChiGiaoHang, 
                                                    DH.NgayGiaoHang
                                                FROM DonHang DH, KhachHang KH
                                                WHERE DH.KhachHangID = KH.KhachHangID
                                                ORDER BY 
                                                    CASE 
                                                        WHEN DH.TrangThai = 'Đang xử lý' THEN 1
                                                        WHEN DH.TrangThai = 'Đang giao hàng' THEN 2
                                                        WHEN DH.TrangThai = 'Đã giao hàng' THEN 3
                                                        WHEN DH.TrangThai = 'Đã hủy' THEN 4
                                                    END,
                                                    DH.NgayDatHang DESC`);
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

async function InsertOrder( KhachHangID, TongGiaTri, TrangThai, DiaChiGiaoHang, ChiTietDonHang ) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);      
        for (const donHang of ChiTietDonHang) {
            const { SanPhamID, SoLuong, KichThuoc } = donHang;

            // Kiểm tra số lượng trong kho có đủ với đơn không, nếu không thì không thực thi lệnh insert và trả lỗi
            const stockCheckResult = await connection.execute(
                `SELECT COUNT(*) AS SoLuong
                 FROM TonKho
                 WHERE 
                    SanPhamID = :SanPhamID AND 
                    KichThuoc = :KichThuoc AND 
                    SoLuong >= :SoLuong`,
                 { SanPhamID, SoLuong, KichThuoc }
            );

            const stockCount = stockCheckResult.rows[0][0];

            if (stockCount ===0) {
                throw new Error(`Sản phẩm có Id ${SanPhamID} với kích thước ${KichThuoc} không đủ số lượng trong kho.`);
            }

            // Cập nhật số lượng table TonKho sau khi kiểm tra
            await connection.execute(
                `UPDATE TonKho
                 SET SoLuong = SoLuong - :SoLuong
                 WHERE SanPhamID = :SanPhamID AND
                       KichThuoc = :KichThuoc`,
                { SanPhamID, SoLuong, KichThuoc }
            );
        }

        const orderResult = await connection.execute('INSERT INTO DonHang (KhachHangID, TongGiaTri, TrangThai, DiaChiGiaoHang) VALUES (:KhachHangID, :TongGiaTri, :TrangThai, :DiaChiGiaoHang) RETURNING DonHangID INTO :DonHangID', 
        {KhachHangID, TongGiaTri, TrangThai, DiaChiGiaoHang, DonHangID: { type: oracledb.NUMBER, dir:oracledb.BIND_OUT} });
        
        // Lấy DonHangID từ kết quả
        const DonHangID = orderResult.outBinds.DonHangID[0];
        
        // Thêm từng sản phẩm vào bảng ChiTietDonHang
        for (const donHang of ChiTietDonHang) {
            const { SanPhamID, KichThuoc, SoLuong, Gia } = donHang;

            await connection.execute(
                `INSERT INTO ChiTietDonHang (DonHangID, SanPhamID, KichThuoc, SoLuong, Gia)
                 VALUES (:DonHangID, :SanPhamID, :KichThuoc, :SoLuong, :Gia)`,
                {
                    DonHangID,
                    SanPhamID,
                    KichThuoc,
                    SoLuong,
                    Gia,
                }
            );
        }
          // Commit transaction
          await connection.commit();
      
          // Giải phóng kết nối
        //   await connection.close();
          return { message: 'Thêm đơn hàng thành công.' };
    } catch (error) {
        // Rollback nếu có lỗi
        await connection.rollback();
        // Định dạng lỗi dưới dạng JSON và ném ra ngoài
        const formattedError = {
            message: error.message || 'Đã xảy ra lỗi không mong muốn.',
        };
        throw formattedError;
    } finally{
        // Giải phóng kết nối
        await connection.close();
    }
}
async function queryOrderById(OrderID) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute('SELECT CT.ChiTietID,CT.DonHangID,SP.TenSanPham,SP.AnhBia,CT.KichThuoc,CT.SoLuong,CT.Gia from ChiTietDonHang CT, SanPham SP where CT.SanPhamID=SP.SanPhamID and CT.DonHangID = :OrderID', [OrderID]);
        // console.log(result.rows);
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
async function queryOrderAdminById(OrderID) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(`select DH.DonHangID,KH.TenKhachHang,DH.NgayDatHang,DH.TongGiaTri,DH.TrangThai,DH.DiaChiGiaoHang,TO_CHAR(DH.NgayGiaoHang, 'DD/MM/YYYY') AS NgayGiaoHang from DonHang DH, KhachHang KH where DH.KhachHangID = KH.KhachHangID and DH.DonHangID = :OrderID`, [OrderID]);
        // console.log(result.rows[0]);
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
async function Order_Info(KhachHangID) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute('SELECT * FROM DonHang WHERE KhachHangID = :KhachHangID  ORDER BY NgayDatHang DESC', [KhachHangID]);
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
async function Delete(DonHangID, KhachHangID) {
    let connection; 
    try {
        connection = await oracledb.getConnection(dbConfig);

        // Thực hiện truy vấn xóa sản phẩm dựa trên id
        const result = await connection.execute('DELETE FROM DonHang WHERE DonHangID = :DonHangID and KhachHangID = :KhachHangID', { DonHangID, KhachHangID });
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
async function Update(OrderID) {
    let connection; 
    try {
        connection = await oracledb.getConnection(dbConfig);

        // Thực hiện truy vấn xóa sản phẩm dựa trên id
        const result = await connection.execute(`UPDATE DonHang SET TrangThai = 'Đã hủy' WHERE DonHangID = :OrderID AND TrangThai = 'Đang xử lý'`, { OrderID });
        await connection.commit(); // Cam kết giao dịch
        await connection.close(); // Đóng kết nối

        if (result.rowsAffected === 0) {
            return { message: 'Đơn hàng đang giao hoặc đã hủy, không thể hủy đơn hàng!!!' };
        }
        return { message: 'Hủy đơn hàng thành công.' };

        // Kiểm tra số lượng hàng bị ảnh hưởng
      
    } catch (error) {
        console.log('Lỗi khi hủy đơn hàng:', error);
        // Có thể thêm xử lý lỗi khác tại đây, ví dụ: ghi log, báo lỗi, vv.
        return { message: 'Đã xảy ra lỗi khi hủy đơn hàng.' };
    }
}





module.exports = { InsertOrder, queryOrder, queryOrderById, queryOrderAdminById, Order_Info, Delete, Update};