# Kế hoạch triển khai: Hệ thống Quản lý Dịch vụ Thú cưng (Pet Care Platform)

Dự án sẽ được khởi tạo và phát triển trực tiếp tại thư mục **`D:\Khoaluantotnghiep`**.
Hệ thống kết hợp giữa quản lý dịch vụ thú cưng (spa/phòng khám), bán hàng E-commerce, quản lý kho thông minh và tích hợp AI dự báo nhu cầu nhập hàng.

---

## Kiến trúc Công nghệ & Mô hình Hệ thống

```
D:\Khoaluantotnghiep
├── backend/            # Express.js + Prisma ORM + PostgreSQL API Server
├── frontend/           # ReactJS (Vite) + Vanilla CSS (Glassmorphism & Responsive UI)
└── ai-service/         # Python FastAPI Microservice (Dự báo nhu cầu & Khuyến nghị nhập kho)
```

1. **Database:** PostgreSQL với Prisma ORM (Đảm bảo tính toàn vẹn giao dịch, hỗ trợ ACID cho lịch hẹn & kho hàng).
2. **Backend (API Server):** Node.js + Express.js, JWT Authentication, RESTful APIs, tích hợp Prisma client.
3. **Frontend (Dashboard & Customer Portal):** ReactJS (Vite framework), Vanilla CSS nâng cao với thiết kế Glassmorphism sang trọng, hiện đại, tích hợp bộ biểu đồ thống kê (Recharts).
4. **AI & Forecasting Engine:** Python (FastAPI microservice), sử dụng thuật toán Time-series forecasting (Scikit-Learn/Moving Average) để tính toán điểm tái đặt hàng (Reorder Point), dự báo sức mua và tự động đề xuất đơn nhập hàng.

---

## User Review Required

> [!IMPORTANT]
> **Vị trí thư mục dự án:** Tất cả source code sẽ được tạo tại thư mục **`D:\Khoaluantotnghiep`**.
> **Cơ sở dữ liệu:** Hệ thống sử dụng **PostgreSQL** kết hợp **Prisma ORM**. Cần có chuỗi kết nối Database `DATABASE_URL` (ví dụ `postgresql://postgres:password@localhost:5432/petcare_db`).

---

## Proposed Changes & Code Structure

### Thư mục Gốc (`D:\Khoaluantotnghiep`)

#### [NEW] [package.json](file:///D:/Khoaluantotnghiep/package.json)
- Script tổng hợp quản lý khởi chạy backend, frontend và ai-service.

---

### Backend Component (`D:\Khoaluantotnghiep\backend`)

#### [NEW] [prisma/schema.prisma](file:///D:/Khoaluantotnghiep/backend/prisma/schema.prisma)
- Thiết kế Data Schema hoàn chỉnh:
  - `User`: Quản lý tài khoản (Roles: `CUSTOMER`, `CARE_STAFF`, `WAREHOUSE_STAFF`, `ADMIN`).
  - `Pet`: Quản lý danh mục thú cưng, hồ sơ sức khỏe.
  - `ServiceCatalog`: Quản lý dịch vụ spa, tiêm chủng, khám chữa bệnh.
  - `Appointment`: Quản lý lịch hẹn, trạng thái khóa slot giờ real-time.
  - `Product`: Danh mục vật tư, thức ăn, phụ kiện, quản lý tồn kho và ngưỡng báo động (`minStockLevel`).
  - `Supplier`: Nhà cung cấp hàng hóa.
  - `StockTransaction`: Nhật ký nhập/xử lý kho.
  - `Order` & `OrderItem`: Đơn hàng mua sắm vật phẩm.
  - `ReorderProposal`: Đề xuất kế hoạch nhập hàng do AI gợi ý.

#### [NEW] [src/server.js](file:///D:/Khoaluantotnghiep/backend/src/server.js)
- Khởi tạo Express server, CORS, JSON parser, routes mounting và error handling middleware.

#### [NEW] [src/controllers/](file:///D:/Khoaluantotnghiep/backend/src/controllers/)
- `authController.js`: Đăng ký, Đăng nhập, Tạo JWT token, Middleware phân quyền theo Role.
- `petController.js`: CRUD thông tin & hồ sơ thú cưng.
- `appointmentController.js`: Đặt lịch, kiểm tra trùng slot giờ, duyệt lịch, cập nhật tiến độ dịch vụ.
- `inventoryController.js`: Quản lý tồn kho, nhập kho, xuất kho, cảnh báo hàng sắp hết.
- `orderController.js`: Xử lý đơn hàng E-commerce & tự động trừ kho.
- `forecastingController.js`: Gọi microservice Python để lấy dự báo nhu cầu & tạo đề xuất nhập hàng.

#### [NEW] [prisma/seed.js](file:///D:/Khoaluantotnghiep/backend/prisma/seed.js)
- Tự động sinh dữ liệu mẫu (Mock data phong phú về khách hàng, thú cưng, dịch vụ, sản phẩm kho, lịch sử bán hàng 6 tháng gần nhất để AI dự báo).

---

### AI Service Component (`D:\Khoaluantotnghiep\ai-service`)

#### [NEW] [main.py](file:///D:/Khoaluantotnghiep/ai-service/main.py)
- Khởi tạo ứng dụng FastAPI.
- Endpoint `/predict`: Phân tích chuỗi thời gian bán hàng & sử dụng dịch vụ để tính toán xu hướng (Trend) và Mùa vụ (Seasonality).
- Endpoint `/reorder-proposals`: Tính toán ngưỡng an toàn tồn kho (Safety Stock), Điểm đặt hàng lại (Reorder Point = Safety Stock + Lead Time Demand) và tự động tạo danh sách đề xuất số lượng cần nhập.

#### [NEW] [requirements.txt](file:///D:/Khoaluantotnghiep/ai-service/requirements.txt)
- Các thư viện Python: `fastapi`, `uvicorn`, `pandas`, `numpy`, `scikit-learn`, `pydantic`.

---

### Frontend Component (`D:\Khoaluantotnghiep\frontend`)

#### [NEW] [src/index.css](file:///D:/Khoaluantotnghiep/frontend/src/index.css)
- Design System hiện đại với theme Glassmorphism:
  - Color Palette: Emerald/Teal kết hợp Dark Navy/Slate cao cấp.
  - CSS Variables, Flex/Grid layouts, Glass card effects, Smooth animations, Modals, Tables, Status Badges.

#### [NEW] [src/App.jsx](file:///D:/Khoaluantotnghiep/frontend/src/App.jsx)
- Cấu trúc Single Page Application với State Router điều hướng theo Role (Customer, Care Staff, Warehouse Staff, Admin).

#### [NEW] [src/components/](file:///D:/Khoaluantotnghiep/frontend/src/components/)
- `Navbar.jsx` & `Sidebar.jsx`: Thanh điều hướng tương tác mượt mà.
- `CustomerPortal.jsx`: Giao diện Khách hàng (Đăt lịch hẹn thông minh, Quản lý hồ sơ thú cưng, Mua sắm sản phẩm).
- `CareStaffDashboard.jsx`: Giao diện Nhân viên chăm sóc (Tiếp nhận & thực hiện lịch hẹn, nhật ký chăm sóc).
- `WarehouseDashboard.jsx`: Giao diện Nhân viên kho (Theo dõi tồn kho, Kiểm kho, Đơn nhập hàng).
- `AdminDashboard.jsx`: Giao diện Quản trị viên (Tổng quan báo cáo doanh thu, Quản lý nhân sự, **Duyệt đề xuất AI Nhập hàng thông minh** với biểu đồ trực quan).

---

## Verification Plan

### Verification Steps
1. **Khởi tạo cơ sở dữ liệu & Seed Data:** Run `npx prisma db push` & `npx prisma db seed` để nạp dữ liệu ban đầu.
2. **Kiểm thử API Endpoints (Backend):** 
   - Auth (Đăng nhập với các tài khoản role khác nhau).
   - Đặt lịch hẹn (Kiểm tra khóa trùng slot).
   - Trừ kho tự động khi hoàn thành dịch vụ hoặc chốt đơn hàng.
3. **Kiểm thử AI Forecasting Microservice:**
   - Đóng góp dữ liệu bán hàng giả lập -> Kiểm tra API trả về số lượng đề xuất nhập hàng hợp lý dựa trên ngưỡng minStock.
4. **Kiểm thử Giao diện (Frontend):**
   - Trải nghiệm giao diện trên browser, kiểm tra responsive, các hiệu ứng UI Glassmorphism, chuyển đổi tab phân quyền theo Role.
