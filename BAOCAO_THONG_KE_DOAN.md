# 📘 BÁO CÁO THUYẾT MINH & ĐẶC TẢ KHOÁ LUẬN TỐT NGHIỆP

## ĐỀ TÀI: HỆ THỐNG QUẢN LÝ DỊCH VỤ THÚ CƯNG TÍCH HỢP DỰ BÁO NHU CẦU VÀ ĐỀ XUẤT KẾ HOẠCH NHẬP HÀNG THÔNG MINH

---

## 1. GIỚI THIỆU TỔNG QUAN

Hệ thống được nghiên cứu và phát triển nhằm cung cấp giải pháp chuyển đổi số toàn diện cho các cơ sở kinh doanh dịch vụ thú cưng (phòng khám thú y, spa grooming, lưu trú và pet shop bán lẻ).

Hệ thống tích hợp 3 trụ cột công nghệ chính:
1. **Giao dịch thương mại điện tử (E-Commerce):** Giỏ hàng, mua thức ăn, phụ kiện, mỹ phẩm spa và thanh toán trực tuyến/COD.
2. **Đặt lịch dịch vụ thông minh (Smart Booking):** Thuật toán khóa khung giờ real-time (Slot Lock) chống trùng lịch hẹn giữa các bác sĩ/nhân viên chăm sóc.
3. **Mô hình AI dự báo chuỗi thời gian (Time-Series AI Forecasting):** Tự động phân tích phương sai, tính điểm đặt hàng lại ($ROP$) và hàng tồn an toàn ($SS$) để tự động đề xuất đơn nhập hàng thông minh, chống đứt gãy chuỗi cung ứng.

---

## 2. PHÂN TÍCH & SỬA LỖI SƠ ĐỒ USE CASE CHUẨN UML

### 2.1 Các lỗi sai trong sơ đồ Use Case cũ & Cách khắc phục:
1. **Lỗi lạm dụng `<<include>>` vào Use Case "2. Đăng nhập":**
   - *Vấn đề:* Vẽ hàng chục mũi tên trỏ vào Đăng nhập tạo ra Anti-pattern "Login Trap / Spider Web". Trong UML, Đăng nhập là **Tiền điều kiện (Precondition)**, không phải bước con phân rã của từng nghiệp vụ. Các Use Case công khai như Xem dịch vụ, Xem hàng hóa Khách vãng lai (Guest) không cần đăng nhập.
   - *Khắc phục:* Bỏ toàn bộ mũi tên `<<include>>` vào Đăng nhập; tách Đăng nhập thành Use Case thuộc Phân hệ Xác thực.
2. **Lỗi trùng số thứ tự:**
   - *Vấn đề:* Sơ đồ cũ có 2 Use Case cùng mang số 18 ("18. Quản lý khuyến mãi" và "18. Quản lý hàng hóa").
   - *Khắc phục:* Đánh số độc lập và phân chia theo từng phân hệ rõ ràng.
3. **Lỗi nhầm lẫn giữa Sơ đồ Hoạt động (Activity Flow) và Phân rã Use Case:**
   - *Vấn đề:* Nhánh AI (22.1 ➔ 22.2 ➔ 22.3) và nhánh Đề xuất (23.1 ➔ 23.2 ➔ 23.3 ➔ 23.4 ➔ 23.5) bị nối chuỗi tuần tự `<<include>>`.
   - *Khắc phục:* Gộp thành Use Case tổng quát, các bước tuần tự được đưa vào đặc tả kịch bản (Flow of Events).
4. **Bổ sung các nghiệp vụ thực tế của Website:**
   - Bổ sung: Mua sắm sản phẩm/thức ăn, Giỏ hàng, Đặt hàng & Thanh toán (COD/VNPAY), Đánh giá 5 sao sau ca dịch vụ.

---

## 3. BẢNG ĐẶC TẢ YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS - FR)

### 3.1 Phân hệ Xác thực & Phân quyền (Authentication & Authorization)
- **FR-01 (Đăng ký tài khoản):** Khách hàng tạo tài khoản bằng Email, Mật khẩu, Họ tên và SĐT với validation chặt chẽ.
- **FR-02 (Đăng nhập & Quản lý phiên):** Xác thực JWT Token, mã hóa Bcrypt, tự động phân quyền theo 4 vai trò (`CUSTOMER`, `CARE_STAFF`, `WAREHOUSE_STAFF`, `ADMIN`).
- **FR-03 (Quản lý thông tin cá nhân):** Xem và chỉnh sửa họ tên, số điện thoại, địa chỉ, ảnh đại diện.
- **FR-04 (Đổi/Khôi phục mật khẩu):** Cho phép đổi mật khẩu hoặc gửi mã xác thực qua email.

### 3.2 Phân hệ Quản lý Thú cưng (Pet Profile Management)
- **FR-05 (Thêm mới hồ sơ thú cưng):** Khách hàng thêm hồ sơ thú cưng (Tên, loài, giống, tháng tuổi, cân nặng, tiền sử y tế, dị ứng).
- **FR-06 (Cập nhật & Xóa hồ sơ):** Chỉnh sửa cân nặng, độ tuổi hoặc xóa hồ sơ thú cưng.
- **FR-07 (Xem lịch sử khám & chăm sóc):** Xem toàn bộ nhật ký khám bệnh, spa grooming của từng bé cưng.

### 3.3 Phân hệ Dịch vụ & Đặt lịch hẹn thông minh (Smart Booking)
- **FR-08 (Tra cứu danh mục dịch vụ):** Tìm kiếm, lọc dịch vụ spa/khám bệnh, xem bảng giá và thời lượng thực hiện.
- **FR-09 (Đặt lịch hẹn & Khóa slot chống trùng):** Chọn Thú cưng ➔ Dịch vụ ➔ Ngày ➔ Khung giờ (Time slot). Hệ thống tự động khóa slot ngăn ngừa Double Booking.
- **FR-10 (Quản lý & Hủy lịch hẹn):** Xem trạng thái lịch hẹn (`PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`) và hủy lịch theo quy định.

### 3.4 Phân hệ Thương mại điện tử & Bán hàng (E-Commerce & Orders)
- **FR-11 (Tìm kiếm & Lọc sản phẩm):** Tra cứu thức ăn, phụ kiện, mỹ phẩm spa theo danh mục, mức giá và tình trạng kho.
- **FR-12 (Giỏ hàng & Khuyến mãi):** Quản lý giỏ hàng, áp dụng Voucher khuyến mãi (`SPA10OFF`, `PETLOVER20`).
- **FR-13 (Đặt hàng & Thanh toán):** Hỗ trợ thanh toán tiền mặt khi nhận hàng (COD) hoặc thanh toán trực tuyến qua VNPAY QR.
- **FR-14 (Đánh giá & Phản hồi):** Đánh giá 1-5 sao và nhận xét chất lượng dịch vụ/sản phẩm.

### 3.5 Phân hệ Nghiệp vụ Nhân viên Chăm sóc (Care Staff / Vet)
- **FR-15 (Tiếp nhận ca hẹn):** Xem danh sách các ca hẹn được phân công trong ngày.
- **FR-16 (Bắt đầu dịch vụ):** Chuyển trạng thái lịch hẹn sang `IN_PROGRESS` khi khách đến cơ sở.
- **FR-17 (Ghi nhật ký chăm sóc & Bệnh án):** Nhập kết quả thăm khám, các bước spa đã làm, thể trạng thú cưng và hoàn tất ca hẹn (`COMPLETED`).

### 3.6 Phân hệ Quản trị Kho hàng (Warehouse & Inventory Management)
- **FR-18 (Quản lý tồn kho):** Hiển thị SKU, Tên, Tồn thực tế (`currentStock`), Ngưỡng an toàn (`minStockLevel`, `maxStockLevel`).
- **FR-19 (Cảnh báo thủng kho):** Tự động hiển thị Badge Đỏ khi tồn kho $\le \text{minStockLevel}$.
- **FR-20 (Nhập / Xuất / Kiểm kê kho):** Lập phiếu Nhập (IN), phiếu Xuất (OUT), phiếu Điều chỉnh (ADJUSTMENT).
- **FR-21 (Lịch sử giao dịch kho):** Lưu vết toàn bộ biến động kho vào bảng `StockTransaction`.

### 3.7 Phân hệ AI Dự báo nhu cầu & Tự động Đề xuất nhập hàng (AI Forecasting)
- **FR-22 (Thu thập dữ liệu tiêu thụ chuỗi thời gian):** Trích xuất lịch sử bán hàng và vật tư dịch vụ trong 30-90 ngày.
- **FR-23 (Mô hình AI dự báo nhu cầu):** Tính toán nhu cầu trung bình ngày ($D_{\text{avg}}$) và độ lệch chuẩn ($\sigma_D$).
- **FR-24 (Tự động tính Tồn an toàn & Điểm đặt hàng lại):**
  - Hàng tồn an toàn: $SS = Z \times \sigma_D \times \sqrt{L}$ (với $Z=1.65$).
  - Điểm đặt hàng lại: $ROP = (D_{\text{avg}} \times L) + SS$.
- **FR-25 (Tạo đề xuất nhập hàng tự động):** Tự động sinh bản ghi `ReorderProposal` ở trạng thái `DRAFT` khi `currentStock` $\le ROP$.
- **FR-26 (Phê duyệt đề xuất nhập hàng):** Admin bấm **Phê duyệt** ➔ Tự động cập nhật tăng tồn kho trong Database.

### 3.8 Phân hệ Báo cáo & Quản trị hệ thống (Admin & Analytics)
- **FR-27 (Quản lý danh mục & NCC):** Cấu hình bảng giá dịch vụ, sản phẩm và thông tin nhà cung cấp.
- **FR-28 (Quản trị người dùng & Phân quyền):** Quản lý tài khoản và phân quyền vai trò.
- **FR-29 (Báo cáo KPI & Biểu đồ doanh thu):** Thống kê doanh thu, tỷ lệ lấp đầy lịch hẹn và hiệu suất kinh doanh.

---

## 4. BẢNG YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS - NFR)

| Mã NFR | Nhóm Tiêu Chuẩn (ISO 25010) | Nội Dung Yêu Cầu Kỹ Thuật |
| :---: | :--- | :--- |
| **NFR-01** | **Hiệu năng (Performance)** | Thời gian phản hồi API $\le 1.0$ giây; AI Microservice dự báo toàn kho $\le 2.5$ giây. |
| **NFR-02** | **Xử lý đồng thời (Concurrency)** | Đáp ứng ổn định tối thiểu 200 người dùng truy cập và đặt lịch cùng lúc. |
| **NFR-03** | **Bảo mật (Security)** | Mật khẩu băm Bcrypt ($\ge 10$ salt rounds); JWT token bảo vệ endpoint; Prisma ORM chống SQL Injection. |
| **NFR-04** | **Phân quyền (RBAC)** | Middleware kiểm tra nghiêm ngặt quyền hạn theo vai trò (`Customer`, `CareStaff`, `WarehouseStaff`, `Admin`). |
| **NFR-05** | **Toàn vẹn dữ liệu (ACID)** | Nghiệp vụ đặt lịch giữ chỗ (Lock Slot) và nhập/xuất kho phải chạy trong Database Transaction. |
| **NFR-06** | **Độ sẵn sàng (Availability)** | Hệ thống đạt độ sẵn sàng tối thiểu 99.5% thời gian hoạt động. |
| **NFR-07** | **Khả năng dự phòng (Fallback)** | Khi AI Microservice ngắt kết nối, Backend Express vẫn hoạt động ổn định và hiển thị thông báo trạng thái. |
| **NFR-08** | **Tính tương thích (Usability/UX)** | Giao diện chuẩn Responsive chạy mượt mà trên Desktop, Tablet và Mobile với phong cách Glassmorphism. |
| **NFR-09** | **Khả năng mở rộng (Maintainability)** | Kiến trúc tách rời (Decoupled 3-tier): Frontend React + Backend Node.js Express + AI Python FastAPI. |

---

## 5. HƯỚNG DẪN TRẢI NGHIỆM TRÊN FILE `PetCareAI_Platform.html` / `index.html`

Bạn có thể mở trực tiếp file `PetCareAI_Platform.html` hoặc `index.html` bằng trình duyệt (Google Chrome, Edge) để trải nghiệm:
1. **Thanh chuyển đổi vai trò (Role Switcher):** Dễ dàng chuyển giữa 4 vai trò (Khách hàng, Nhân viên chăm sóc, Nhân viên kho, Admin).
2. **Khách hàng:** Đặt lịch dịch vụ có khóa slot giờ real-time, thêm thú cưng, mua hàng và thanh toán.
3. **Nhân viên chăm sóc:** Nhận ca hẹn, cập nhật tiến độ và ghi nhật ký y tế/bệnh án.
4. **Nhân viên kho:** Theo dõi tồn kho, cảnh báo thủng kho đỏ và xem nhật ký xuất/nhập.
5. **Admin:** Xem biểu đồ KPI, chạy AI dự báo nhu cầu chuỗi thời gian và bấm duyệt đơn nhập hàng tự động.
6. **Tab "Đặc Tả SRS & Use Cases":** Xem toàn bộ đặc tả và bấm nút sao chép nội dung vào Word/Báo cáo luận văn.
