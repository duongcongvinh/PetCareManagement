# 🐾 HỆ THỐNG QUẢN LÝ DỊCH VỤ THÚ CƯNG & DỰ BÁO NHU CẦU NHẬP HÀNG THÔNG MINH
> **Đồ Án Khoá Luận Tốt Nghiệp** - Nền tảng quản lý toàn diện cho phòng khám thú y, spa thú cưng, bán hàng e-commerce kết hợp AI dự báo nhu cầu nhập kho.

---

## 🛠️ KIẾN TRÚC CÔNG NGHỆ (TECH STACK)

1. **Backend API Core Service (3-Tier Layered Architecture):**
   - **Framework:** Node.js + Express.js
   - **Kiến trúc mã nguồn:** Controller $\rightarrow$ Service $\rightarrow$ Data Access Layer (Prisma)
   - **ORM:** Prisma ORM v5 (MongoDB Provider)
   - **Cơ sở dữ liệu:** MongoDB 7.0 (NoSQL Document Database)
   - **Xác thực & Bảo mật:** JWT (JSON Web Tokens) & Bcryptjs
2. **Frontend UI/UX:**
   - **Framework:** ReactJS (Vite framework)
   - **Styling:** Vanilla CSS (Glassmorphism modern design, animations & metrics)
   - **Icons:** Lucide React Icons
3. **AI & Demand Forecasting Microservice:**
   - **Framework:** Python FastAPI
   - **Thuật toán ML/AI:** Time-series Forecasting, Safety Stock Calculation & Scikit-Learn
4. **DevOps & Containerization:**
   - **Docker & Docker Compose** (Điều phối 5 container: MongoDB, Mongo Express, Backend, AI Service, Frontend)
   - **Mongo-Express Web UI:** Quản lý cơ sở dữ liệu trực quan qua trình duyệt.

---

## 📁 CẤU TRÚC THƯ MỤC DỰ ÁN

```
PetCareManagement/
├── docker-compose.yml        # Điều phối 5 Containers
├── backend/                  # API Server Node.js + Express
│   ├── Dockerfile
│   ├── prisma/
│   │   ├── schema.prisma     # Định nghĩa Data Models MongoDB (ObjectId)
│   │   └── seed.js           # Khởi tạo dữ liệu mẫu phong phú
│   ├── src/
│   │   ├── config/           # Cấu hình Prisma Client Singleton
│   │   ├── controllers/      # Tầng nhận/trả HTTP Request
│   │   ├── services/         # Tầng Business Logic & Truy vấn Database
│   │   │   ├── authService.js
│   │   │   ├── petService.js
│   │   │   ├── appointmentService.js
│   │   │   ├── inventoryService.js
│   │   │   ├── orderService.js
│   │   │   └── forecastingService.js
│   │   ├── middleware/       # JWT Auth & Role Authorization (RBAC)
│   │   ├── routes/           # RESTful API Endpoints
│   │   └── server.js         # Khởi chạy Express Server
│   ├── .env                  # Cấu hình chuỗi kết nối MongoDB & PORT
│   └── package.json
│
├── frontend/                 # ReactJS Client Portal & Management Dashboards
│   ├── Dockerfile
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Header & Role Simulator Switcher
│   │   │   ├── Sidebar.jsx           # Menu điều hướng theo vai trò
│   │   │   ├── CustomerPortal.jsx    # Đặt lịch, Quản lý Pet, Mua sắm
│   │   │   ├── CareStaffDashboard.jsx# Tiếp nhận & Làm dịch vụ, Nhật ký chăm sóc
│   │   │   ├── WarehouseDashboard.jsx# Quản lý kho, Xuất/Nhập kho
│   │   │   ├── AdminDashboard.jsx    # Báo cáo KPI, Biểu đồ & Duyệt đơn AI
│   │   │   └── LoginModal.jsx        # Đăng nhập/Đăng ký tài khoản mẫu
│   │   ├── index.css                 # Glassmorphism Design System
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
└── ai-service/               # Python Microservice Dự Báo AI
    ├── Dockerfile
    ├── main.py               # Thuật toán dự báo nhu cầu & gợi ý nhập hàng
    └── requirements.txt
```

---

## 🐳 KHỞI CHẠY BẰNG DOCKER COMPOSE (Khuyên Dùng - 1 Lệnh Duy Nhất)

Chạy lệnh Docker Compose (khuyên dùng Docker Compose v2 với khoảng trắng):

```bash
docker compose up -d --build
```
*(Nếu dùng Docker Compose v1 cũ, chạy: `docker-compose up -d --build`)*

Sau khi khởi động xong, toàn bộ các dịch vụ sẽ sẵn sàng:

| Dịch vụ | URL Truy Cập | Chức Năng |
| :--- | :--- | :--- |
| **Frontend Web App** | `http://localhost:3000` | Giao diện Khách hàng & Dashboard Quản trị viên/Nhân viên |
| **Backend API** | `http://localhost:5000/api` | RESTful API Endpoints |
| **AI Demand Forecasting Docs** | `http://localhost:8000/docs` | Swagger UI kiểm tra API AI Microservice |
| **Mongo Express (DB Manager)** | `http://localhost:8081` | Giao diện Web xem và quản lý Database MongoDB trực tiếp |
| **MongoDB Database** | `localhost:27017` | Cổng kết nối Database NoSQL |

---

## 💻 KHỞI CHẠY THỦ CÔNG (LOCAL DEVELOPMENT)

### 1. Khởi chạy MongoDB & Backend:
```bash
cd backend
npm install

# Đồng bộ Schema với MongoDB:
npx prisma db push

# Nạp dữ liệu mẫu ban đầu:
node prisma/seed.js

# Chạy Backend Server:
npm run dev
# Server sẽ chạy tại http://localhost:5000
```

### 2. Khởi chạy AI Microservice (Python):
```bash
cd ai-service
pip install -r requirements.txt
python main.py
# FastAPI Microservice sẽ chạy tại http://localhost:8000
```

### 3. Khởi chạy Giao diện Frontend (React):
```bash
cd frontend
npm install
npm run dev
# Web app sẽ chạy tại http://localhost:3000
```

---

## 🔑 TÀI KHOẢN MẪU ĐỂ TEST HỆ THỐNG

Bạn có thể sử dụng nút **Role Demo Simulator** trên thanh Navbar hoặc Đăng nhập bằng các tài khoản mẫu sau:

| Vai Trò (Role) | Email | Mật Khẩu | Quyền Hạn |
| :--- | :--- | :--- | :--- |
| **Quản Trị Viên (Admin)** | `admin@petcare.com` | `123456` | Xem báo cáo tổng quan, **Duyệt/Từ chối đề xuất nhập hàng từ AI**, quản lý hệ thống. |
| **Nhân Viên Chăm Sóc (Care Staff)** | `care@petcare.com` | `123456` | Tiếp nhận lịch hẹn, làm dịch vụ Spa/Y tế, ghi lại nhật ký chăm sóc thú cưng. |
| **Nhân Viên Kho (Warehouse Staff)** | `warehouse@petcare.com` | `123456` | Điều chỉnh tồn kho, xem cảnh báo thủng kho, kích hoạt kiểm tra AI. |
| **Khách Hàng (Customer)** | `khachhang@gmail.com` | `123456` | Tạo hồ sơ thú cưng, đặt lịch hẹn chọn slot giờ, mua sản phẩm. |
