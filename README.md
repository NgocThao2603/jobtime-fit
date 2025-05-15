jobtime-fit là một dự án web sử dụng React, JavaScript, Vite cho phần frontend và Node.js, Express, MySQL cho phần backend.<br>

**1. Clone Project từ GitHub**<br>
Để bắt đầu, bạn cần clone dự án về máy của mình từ GitHub: git clone https://github.com/NgocThao2603/jobtime-fit.git

cd jobtime-fit

**2. Cài Đặt Môi Trường**<br>

**_Cài Đặt MySQL_**<br>
Nếu bạn chưa cài MySQL, bạn có thể tải và cài đặt MySQL từ MySQL Downloads.

mysql Ver 8.0.37 for Win64 on x86_64 (MySQL Community Server - GPL)

Khởi tạo Cơ sở dữ liệu (Database):

Mở MySQL Command Line Client hoặc MySQL Workbench. Đăng nhập vào MySQL với tài khoản root (hoặc tài khoản bạn đã tạo khi cài MySQL): mysql -u root -p

Cấp quyền truy cập cho người dùng root: GRANT ALL PRIVILEGES ON nomnom.\* TO 'root'@'localhost' IDENTIFIED BY 'your_password'; FLUSH PRIVILEGES;<br> Lưu ý: Hãy thay your_password bằng mật khẩu mà bạn muốn đặt cho tài khoản root.

**_Cài Đặt Frontend_**<br>
Tải NodeJS v22.11.0: Node.js — Run JavaScript Everywhere

Di chuyển vào thư mục frontend: cd frontend

Cài đặt các package phụ thuộc: npm install

Chạy ứng dụng frontend: npm run dev

Ứng dụng frontend sẽ được chạy tại http://localhost:5173.

**_Cài Đặt Backend_**<br>
Di chuyển vào thư mục backend: cd backend

Cài đặt các package phụ thuộc: npm install

Tạo file .env trong thư mục backend với các biến môi trường cần thiết:

PORT=5000<br>
DB_HOST=localhost<br>
DB_USER=root<br>
DB_PASSWORD=your_password # Thay bằng mật khẩu root của bạn<br>
DB_NAME=jobtime_fit<br>

Lưu ý: Đảm bảo thay your_root_password bằng mật khẩu thật của tài khoản root mà bạn đã thiết lập trong MySQL.<br>

Tạo database: npx sequelize-cli db:create<br>
Xóa database: npx sequelize-cli db:drop <br>
Tạo các bảng trong database: npx sequelize-cli db:migrate<br>
Thêm dữ liệu vào bảng: npx sequelize-cli db:seed:all <br>
Chạy ứng dụng backend: npm start<br>
Kiểm tra backend: Sau khi chạy lệnh trên, ứng dụng backend sẽ được chạy tại http://localhost:5000.<br>
Truy cập api liên quan đến lịch: http://localhost:5000/api/v1/calendar<br>
Truy cập api liên quan đến công việc: http://localhost:5000/api/v1/jobs<br>
