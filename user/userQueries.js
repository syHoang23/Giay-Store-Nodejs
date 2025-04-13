const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');
async function initialize() {
    try {
        await oracledb.createPool({
            user: dbConfig.user,
            password: dbConfig.password,
            connectString: dbConfig.connectString
        });
        console.log('Connection pool created successfully..');
    } catch (err) {
        console.error('Error creating connection pool:', err);
    }
}

initialize()
async function checkLogin(TenDangNhap, MatKhau) {
    let connection;
    try {
        // Kết nối vào Oracle
        connection = await oracledb.getConnection(dbConfig);

        // Thực hiện truy vấn SELECT trên bảng người dùng, kiểm tra tên người dùng và mật khẩu
        const result = await connection.execute('SELECT * FROM KhachHang WHERE TenDangNhap = :TenDangNhap and MatKhau = :MatKhau', [TenDangNhap, MatKhau]);

        return result.rows[0];
    } catch (err) {
        // Nếu có lỗi, ném ra lỗi để xử lý ở phần gọi hàm
        throw err;
    } finally {
        // Đóng kết nối
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Lỗi khi đóng kết nối:', err);
            }
        }
    }
}

// Hàm để lấy thông tin người dùng từ username
async function getUserInfoByUsername(KhachHangID) {
    let connection;
    try {
        // Kết nối vào Oracle
        connection = await oracledb.getConnection(dbConfig);

        // Thực hiện truy vấn SELECT trên bảng người dùng dựa trên tên người dùng
        const result = await connection.execute('SELECT * FROM KhachHang WHERE KhachHangID = :KhachHangID', [KhachHangID]);

        // Trả về thông tin người dùng
        return result.rows[0]; // Chú ý: Đây là một mảng, lấy phần tử đầu tiên nếu có
    } finally {
        // Đóng kết nối
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Lỗi khi đóng kết nối:', err);
            }
        }
    }
}
async function registerUser(TenDangNhap, MatKhau, Email, TenKhachHang, soDienThoai, diaChi, Role = 'USER') {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        // Thực hiện truy vấn để kiểm tra xem tên người dùng đã tồn tại chưa
        const result = await connection.execute('SELECT count(*) as count FROM KhachHang WHERE TenDangNhap= :TenDangNhap', [TenDangNhap]);
        if (result.rows[0].count > 0) {
            throw new Error('Tên người dùng đã tồn tại.');
        }

        // Thực hiện truy vấn để chèn người dùng mới vào cơ sở dữ liệu với vai trò mặc định là 'user'
        await connection.execute('INSERT INTO KhachHang (TenDangNhap, MatKhau, Email, TenKhachHang, SoDienThoai, DiaChi, Role) VALUES (:TenDangNhap,:MatKhau,:Email,:TenKhachHang,:soDienThoai,:diaChi,:role)',
            { TenDangNhap, MatKhau, Email, TenKhachHang, soDienThoai, diaChi, Role});

        // Commit transaction
        await connection.commit();

        // Giải phóng kết nối
        await connection.close();

        return { message: 'Tài khoản đã được tạo thành công.' };

    } catch (error) {
        console.error('Lỗi khi đăng ký tài khoản:', error);
        throw error;
    }
}

module.exports = { checkLogin, getUserInfoByUsername, registerUser };
