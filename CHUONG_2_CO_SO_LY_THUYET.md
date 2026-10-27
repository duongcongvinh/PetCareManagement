# CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ SỬ DỤNG

---

## 2.1. TỔNG QUAN HỆ THỐNG QUẢN LÝ DỊCH VỤ CHĂM SÓC THÚ CƯNG

Hệ thống quản lý dịch vụ chăm sóc thú cưng (Pet Care Management System) là một giải pháp công nghệ thông tin tích hợp toàn diện, được thiết kế chuyên biệt nhằm chuẩn hóa, tự động hóa và tối ưu hóa toàn bộ các hoạt động vận hành tại các cơ sở kinh doanh thú cưng—từ phòng khám thú y, trung tâm spa grooming, khách sạn lưu trú (pet boarding) cho đến các cửa hàng bán lẻ vật phẩm, thức ăn và thuốc chuyên dụng.

Khác với các hệ thống phần mềm quản lý bán hàng thông thường (Point of Sale - POS) chỉ tập trung vào việc thanh toán hóa đơn, hệ thống quản lý dịch vụ thú cưng mang tính chất đặc thù cao bởi sự kết hợp đồng thời giữa **nghiệp vụ dịch vụ chuyên môn** (đặt lịch, phân công kỹ thuật viên theo khung thời gian thực, quản lý bệnh án/hồ sơ sinh học thú cưng) và **chuỗi cung ứng thương mại điện tử** (quản lý tồn kho hàng hóa, kiểm soát vật tư tiêu hao spa/y tế, và dự báo nhu cầu tiêu thụ định lượng bằng trí tuệ nhân tạo). Hệ thống đóng vai trò như một "trung tâm điều hành số", đồng bộ hóa dòng thông tin và dòng công việc giữa bốn chủ thể then chốt: Khách hàng (Customer), Nhân viên kỹ thuật/Bác sĩ (Care Staff), Nhân viên thủ kho (Warehouse Staff) và Quản trị viên/Chủ cơ sở (Admin).

---

### 2.1.1. Vai trò của hệ thống quản lý dịch vụ thú cưng và chuỗi cung ứng vật tư

#### Bối cảnh thị trường và thực trạng vận hành
Cùng với xu hướng "Pet Humanization" (coi thú cưng như thành viên trong gia đình), nhu cầu chăm sóc sức khỏe, làm đẹp (spa, grooming) và dinh dưỡng cho thú cưng tăng trưởng mạnh mẽ. Tuy nhiên, phần lớn cơ sở vừa và nhỏ hiện nay vẫn vận hành thủ công và đối mặt với các hạn chế lớn:
- **Tiếp nhận dịch vụ phân mảnh:** Đặt lịch qua tin nhắn hoặc sổ tay dễ gây trùng ca (Double Booking), quá tải giờ cao điểm nhưng lại lãng phí thời gian trống trong tuần.
- **Dồn ứ và nguy cơ lây nhiễm chéo:** Thú cưng chờ đợi lâu trong không gian chung dễ bị căng thẳng (stress) và tăng nguy cơ lây lan mầm bệnh chéo.
- **Thất thoát và đứt gãy vật tư:** Quản lý kho thủ công khiến cơ sở dễ rơi vào tình trạng "thủng kho" (hết sữa tắm, thuốc điều trị làm gián đoạn dịch vụ) hoặc "ứ đọng vốn" (nhập thừa hàng cận hạn sử dụng).
- **Hồ sơ chăm sóc ngắt quãng:** Thiếu bệnh án điện tử tập trung khiến nhân viên khó theo dõi tiền sử bệnh, dị ứng hay thói quen của thú cưng.

#### Vai trò đối với Khách hàng (Customer)
- **Chủ động thời gian:** Đặt lịch hẹn trực tuyến 24/7 theo khung giờ trống thực tế (Slot rảnh), tra cứu giá minh bạch và chọn nhân viên yêu thích.
- **Hồ sơ thú cưng số hóa:** Lưu trữ trọn đời thể trạng, lịch sử tiêm chủng và nhật ký dịch vụ của từng thú cưng trên cùng một tài khoản.
- **Mua sắm tiện lợi:** Tích hợp giỏ hàng mua sắm thức ăn, phụ kiện chính hãng kèm dịch vụ trong một lần giao dịch.

#### Vai trò đối với Cơ sở kinh doanh và Nhân viên vận hành
- **Tối ưu năng suất, chống trùng lịch:** Thuật toán khóa slot thời gian thực giúp phân bổ công việc đều đặn cho kỹ thuật viên, loại bỏ hoàn toàn trùng ca.
- **Cải thiện chất lượng dịch vụ:** Cho phép kỹ thuật viên ghi chú lâm sàng (Care Summary) sau mỗi ca hẹn, giúp nâng cao tính chuyên nghiệp và giữ chân khách hàng.
- **Kiểm soát tài chính minh bạch:** Phân tích doanh thu đa kênh (Dịch vụ và Bán lẻ), hỗ trợ theo dõi biên lợi nhuận và định giá chính xác.

#### Vai trò đối với Chuỗi cung ứng và Quản trị kho thông minh
- **Chủ động kiểm soát tồn kho:** Thiết lập cơ chế giám sát tồn kho liên tục, thay thế phương thức kiểm kê thụ động.
- **Dự báo nhu cầu bằng Trí tuệ nhân tạo (AI):** Ứng dụng mô hình học máy kết hợp yếu tố mùa vụ và thời tiết để tính toán mức Tồn kho an toàn (Safety Stock) và Điểm đặt hàng lại (Reorder Point), tự động đề xuất đơn nhập hàng thông minh, chống đứt gãy chuỗi cung ứng.

---

### 2.1.2. Các chức năng cốt lõi của hệ thống quản lý dịch vụ thú cưng

Hệ thống phân chia quyền hạn rõ ràng cho 4 vai trò (Khách hàng, Nhân viên chăm sóc, Nhân viên kho, Quản trị viên) với 7 phân hệ chức năng chính:

- **Quản lý hồ sơ thú cưng:** Lưu trữ thông tin chi tiết từng bé thú cưng (tên, giống loài, tuổi, cân nặng, tiền sử bệnh án, dị ứng) và theo dõi lịch sử dịch vụ trọn đời.
- **Đặt lịch hẹn thông minh:** Khách hàng chọn dịch vụ (tắm spa, cắt tỉa lông, tiêm phòng) và chọn khung giờ còn trống. Hệ thống tự động khóa khung giờ đã kín để tránh trùng lịch hẹn.
- **Mua sắm sản phẩm trực tuyến:** Khách hàng đặt mua thức ăn, phụ kiện, thuốc điều trị có áp mã giảm giá; hệ thống tự động trừ số lượng hàng trong kho ngay khi đơn hàng hoàn tất.
- **Quản lý kho hàng:** Theo dõi các hoạt động nhập - xuất - điều chỉnh tồn kho của từng sản phẩm, tự động phát cảnh báo khi hàng chạm mức tối thiểu để kịp thời bổ sung.
- **Dự báo nhập hàng bằng AI:** Dựa vào tốc độ tiêu thụ và yếu tố thời tiết/mùa vụ (nắng nóng, mùa mưa, dịp Lễ Tết) để tính toán và gợi ý số lượng cần nhập kho, giúp cửa hàng không bị đứt hàng và không bị đọng vốn.
- **Báo cáo và Thống kê:** Cung cấp biểu đồ doanh thu trực quan, phân tích tỷ trọng giữa mảng dịch vụ và bán lẻ, giúp chủ cơ sở nắm bắt tình hình kinh doanh dễ dàng.
- **Phân quyền và Bảo mật:** Phân chia quyền thao tác đúng vai trò công việc và bảo vệ an toàn thông tin tài khoản người dùng bằng cơ chế mã hóa hiện đại.

---

#### Bảng tổng hợp ánh xạ Tác nhân (Actor) và Phân hệ chức năng trong hệ thống:

| Tác nhân (Actor) | Phân hệ tương tác chính | Thẩm quyền & Hành động nghiệp vụ | Giá trị nghiệp vụ mang lại |
| :--- | :--- | :--- | :--- |
| **Khách vãng lai (Guest)** | • Trang chủ & Danh mục | Tra cứu dịch vụ, xem sản phẩm, tạo tài khoản mới. | Tiếp cận và thu hút khách hàng mới. |
| **Khách hàng (Customer)** | • Hồ sơ thú cưng<br>• Đặt lịch hẹn<br>• Mua sắm (E-Commerce) | Quản lý danh sách thú cưng cá nhân, đặt lịch theo slot rảnh, mua hàng, xem nhật ký chăm sóc. | Trải nghiệm dịch vụ tiện lợi, minh bạch, chủ động thời gian. |
| **Nhân viên chăm sóc (Care Staff)** | • Hàng đợi ca hẹn (Queue)<br>• Nhật ký dịch vụ (Care Log) | Xem ca hẹn được phân công, cập nhật trạng thái làm việc, nhập tóm tắt thể trạng thú cưng sau dịch vụ. | Nâng cao năng suất lao động, cá nhân hóa chất lượng phục vụ khách hàng. |
| **Nhân viên kho (Warehouse Staff)** | • Quản lý tồn kho<br>• Xuất / Nhập / Kiểm kê<br>• Kích hoạt AI | Cập nhật số lượng vật tư, nhập kho nhà cung cấp, giám sát cảnh báo thủng kho, gửi yêu cầu phân tích AI. | Duy trì tính liên tục của vật tư spa/thuốc thú y, chống thất thoát hàng hóa. |
| **Quản trị viên (Admin)** | • Bảng điều khiển (Dashboard)<br>• Phân quyền tài khoản<br>• Danh mục & Bảng giá<br>• Duyệt đề xuất nhập kho AI | Quản trị người dùng, điều chỉnh bảng giá dịch vụ, phê duyệt/từ chối đơn đề xuất nhập hàng do AI tính toán, xem báo cáo KPI. | Ra quyết định kinh doanh dựa trên dữ liệu định lượng, tối ưu hóa biên lợi nhuận và chi phí vốn. |

---

## 2.2. CÁC KHÁI NIỆM VÀ MÔ HÌNH LÝ THUYẾT LIÊN QUAN

### 2.2.1. Hệ thống thông tin quản lý (MIS) trong vận hành PetCare
Hệ thống thông tin quản lý (MIS) trong đề tài được hiểu đơn giản là một phần mềm web giúp số hóa toàn bộ hoạt động của cửa hàng thú cưng lên cùng một hệ thống duy nhất:
- Thay vì ghi chép lịch hẹn vào sổ tay hay quản lý hàng hóa bằng file Excel rời rạc dễ thất lạc, toàn bộ dữ liệu của 4 nhóm người dùng (Khách hàng, Nhân viên chăm sóc, Nhân viên kho, Quản trị viên) được liên kết chặt chẽ với nhau.
- Ví dụ thực tế trên web: Khi khách hàng đặt lịch spa, nhân viên chăm sóc lập tức thấy lịch trong hàng đợi công việc; khi khách mua một bịch thức ăn, nhân viên kho thấy số lượng tồn kho tự động giảm đi, và người quản lý có thể xem doanh thu tổng hợp ngay trên bảng điều khiển.

### 2.2.2. Cơ sở dữ liệu NoSQL (MongoDB)
Hệ thống lựa chọn cơ sở dữ liệu phi quan hệ MongoDB để lưu trữ toàn bộ thông tin của cửa hàng vì các lý do thực tế sau:
- **Dữ liệu linh hoạt:** Mỗi bé thú cưng có thể có giống loài khác nhau, cân nặng, tiền sử bệnh án hoặc dị ứng khác nhau; mỗi đơn hàng mua sắm lại có danh sách nhiều sản phẩm khác nhau. MongoDB lưu dữ liệu dưới dạng các tài liệu (Document) giống như file JSON, giúp việc lưu trữ và thay đổi thông tin diễn ra rất tự nhiên và thuận tiện.
- **Tốc độ truy xuất nhanh:** Dữ liệu lịch hẹn, nhật ký chăm sóc và thông tin thú cưng có thể đọc và ghi nhanh chóng mà không cần phải thực hiện các câu lệnh nối bảng (JOIN) phức tạp, giúp các trang Dashboard của nhân viên tải dữ liệu mượt mà.

### 2.2.3. Kiến trúc phần mềm phân tầng kết hợp Microservice
Hệ thống được xây dựng kết hợp giữa kiến trúc phân tầng rõ ràng ở máy chủ chính và một dịch vụ AI độc lập:
- **Giao diện người dùng (Frontend - ReactJS & Vite):** Là trang web trực quan nơi khách hàng đặt lịch, mua sắm và nhân viên thao tác quản lý.
- **Máy chủ nghiệp vụ chính (Backend - Node.js Express & Prisma ORM):** Chịu trách nhiệm xử lý các nghiệp vụ như đăng nhập, đặt lịch, thanh toán đơn hàng và giao tiếp với cơ sở dữ liệu MongoDB thông qua công cụ Prisma.
- **Dịch vụ AI dự báo độc lập (AI Microservice - Python FastAPI):** Được xây dựng tách riêng thành một dịch vụ chạy trên cổng 8000. Lý do tách riêng: Các tác vụ huấn luyện học máy và tính toán số liệu thống kê tiêu tốn nhiều tài nguyên xử lý; việc để Python chạy độc lập giúp máy chủ chính Node.js luôn phản hồi nhanh, không bị đơ giật khi chạy các tác vụ phân tích dữ liệu lớn. Hai máy chủ giao tiếp với nhau qua chuẩn API (HTTP/JSON).

### 2.2.4. Quản trị tồn kho: Điểm đặt hàng lại (ROP) và Tồn kho an toàn (Safety Stock)
Trong phân hệ kho của web, nhân viên có thể bấm nút "Kích hoạt kiểm tra AI". Hệ thống sẽ dựa vào lịch sử bán hàng 30 ngày gần nhất để tính toán khoa học việc nhập hàng theo 2 công thức:

**1. Tồn kho an toàn (Safety Stock - SS):**
Là lượng hàng dự phòng lưu sẵn trong kho để phòng ngừa những ngày khách mua tăng đột biến hoặc nhà cung cấp giao hàng trễ:
`SS = Z × σd × √L`
- `Z = 1.65`: Hệ số tin cậy tương ứng với mức độ đáp ứng 95% nhu cầu khách hàng.
- `σd`: Độ lệch chuẩn của lượng tiêu thụ hàng ngày (đo mức độ biến động bán hàng trong 30 ngày qua).
- `L`: Thời gian chờ nhà cung cấp giao hàng (Lead Time, mặc định hệ thống cài đặt là 5 ngày).

**2. Điểm đặt hàng lại (Reorder Point - ROP):**
Là mức số lượng tồn kho mà khi hàng thực tế giảm xuống bằng hoặc thấp hơn mức này, hệ thống sẽ tự động phát sinh đề xuất nhập hàng:
`ROP = (Nhu cầu bán trung bình ngày × Số ngày chờ hàng) + Tồn kho an toàn`

**3. Đề xuất số lượng cần nhập:**
Khi tồn kho thực tế rớt xuống dưới điểm ROP (hoặc dưới mức tối thiểu cài đặt), hệ thống sẽ tự động gợi ý:
`Số lượng đề xuất nhập = Mức tồn kho tối đa - Số lượng hiện có trong kho`
Đề xuất này xuất hiện trên màn hình của Quản trị viên (Admin) kèm lý do rõ ràng để Admin bấm duyệt nhập kho.

### 2.2.5. Dự báo nhu cầu theo mùa vụ và thời tiết
Trên thực tế tại cơ sở thú cưng, nhu cầu làm đẹp và mua sắm chịu ảnh hưởng rất lớn theo thời tiết và các dịp lễ trong năm. Hệ thống phân tích chu kỳ dữ liệu thành 3 mùa rõ rệt:
- **Mùa Nắng Nóng (Tháng 4 đến Tháng 8):** Nhiệt độ cao (34°C - 38°C), thú cưng dễ bị nóng bức nên nhu cầu tắm mát, cắt tỉa lông (Grooming) và mua sữa tắm dưỡng lông tăng cao (khoảng +48%).
- **Mùa Mưa (Tháng 9 đến Tháng 11):** Mưa nhiều, độ ẩm không khí cao làm thú cưng dễ bị nấm da, ve rận, viêm tai; nhu cầu khám da liễu, mua thuốc trị nấm, xịt khử khuẩn và cát vệ sinh tăng mạnh (khoảng +35%).
- **Dịp Lễ Tết và Cuối năm (Tháng 12 đến Tháng 2):** Khách hàng có nhu cầu làm đẹp cho thú cưng đón năm mới và gửi thú cưng vào khách sạn lưu trú (Pet Hotel) khi đi du lịch hoặc về quê, khiến doanh thu dịch vụ đạt đỉnh cao nhất trong năm (+80%).

### 2.2.6. Mô hình Rừng ngẫu nhiên (Random Forest Regressor)
Trong dịch vụ AI của hệ thống (`ai-service/main.py`), mô hình học máy **Random Forest Regressor** (thuộc thư viện Scikit-Learn) được áp dụng để dự báo số liệu kinh doanh:
- **Cách hoạt động dễ hiểu:** Thay vì chỉ dùng một cây quyết định đơn lẻ dễ đoán sai, thuật toán kết hợp nhiều cây quyết định độc lập (hệ thống cài đặt 50 cây). Mỗi cây sẽ tự học từ các số liệu quá khứ (gồm năm, tháng, nhiệt độ, lượng mưa, mùa vụ) rồi đưa ra kết quả riêng. Cuối cùng, mô hình lấy giá trị trung bình của tất cả các cây để ra con số dự đoán đáng tin cậy nhất.
- **Ứng dụng trên web:** Mô hình giúp dự báo trước cho 6 tháng tới về: Doanh thu dự kiến, số lượng khách sẽ đặt dịch vụ spa, và số lượng sản phẩm bán ra. Nhờ đó, người quản lý có thể chủ động sắp xếp thêm nhân viên trước mùa cao điểm và chuẩn bị vốn nhập hàng đúng thời điểm.

---

## 2.3. PHƯƠNG PHÁP PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

### 2.3.1. Ngôn ngữ mô hình hóa thống nhất (UML)
UML (Unified Modeling Language) là bộ công cụ chuẩn hóa bằng sơ đồ trực quan, giúp người lập trình và các bên liên quan dễ dàng hình dung kiến trúc, chức năng và luồng dữ liệu của hệ thống web trước khi viết mã nguồn. Trong đề tài, các sơ đồ UML được áp dụng gồm:
- **Biểu đồ Use Case (Use Case Diagram):** Thể hiện rõ các tác nhân tham gia vào trang web (Khách hàng, Nhân viên chăm sóc, Nhân viên kho, Quản trị viên) và các quyền hạn, chức năng mà từng người được phép thao tác.
- **Biểu đồ Hoạt động (Activity Diagram):** Mô tả chi tiết từng bước xử lý logic của các nghiệp vụ quan trọng, ví dụ như quy trình đặt lịch (kiểm tra khung giờ rảnh, tự động khóa tránh trùng lịch) hay quy trình AI tính toán đề xuất nhập hàng.
- **Biểu đồ Tuần tự (Sequence Diagram):** Mô tả dòng chảy thông tin và thứ tự gọi API theo thời gian giữa giao diện người dùng (ReactJS Frontend), máy chủ nghiệp vụ (Node.js/Express Backend), máy chủ trí tuệ nhân tạo (Python FastAPI) và cơ sở dữ liệu (MongoDB).
- **Biểu đồ Lớp (Class Diagram) / Mô hình dữ liệu:** Thể hiện cấu trúc các thực thể dữ liệu và mối quan hệ liên kết giữa chúng trong cơ sở dữ liệu.

### 2.3.2. Chuẩn mô hình hóa quy trình nghiệp vụ (BPMN)
BPMN (Business Process Model and Notation) là chuẩn sơ đồ hóa quy trình vận hành thực tế của cửa hàng. Bằng cách phân chia các luồng công việc thành các "làn bơi" (Swimlanes) tương ứng với từng vai trò (Khách hàng, Nhân viên, Quản trị viên), BPMN giúp mọi bộ phận hiểu rõ trách nhiệm và các mốc chuyển giao công việc từ lúc bắt đầu cho đến khi hoàn tất dịch vụ.

### 2.3.3. Các quy trình nghiệp vụ thực tế trên hệ thống

- **Quy trình Đặt lịch và Thực hiện dịch vụ chăm sóc thú cưng:**
  Khách hàng đăng nhập vào hệ thống, chọn hồ sơ thú cưng và chọn dịch vụ cần thực hiện (như Tắm spa, Cắt tỉa lông hoặc Khám sức khỏe). Khách chọn ngày và khung giờ còn trống; hệ thống sẽ tự động kiểm tra và khóa tạm thời khung giờ đó để tránh xung đột lịch hẹn. Khi lịch hẹn được tạo, ca hẹn chuyển vào danh sách chờ tiếp nhận của Nhân viên chăm sóc. Nhân viên tiếp nhận ca hẹn, chuyển trạng thái sang "Đang thực hiện". Sau khi hoàn tất dịch vụ, nhân viên nhập ghi chú thể trạng và dặn dò chăm sóc (Care Summary), bấm chuyển trạng thái sang "Hoàn thành" để hệ thống ghi nhận doanh thu và lưu vào nhật ký sức khỏe của thú cưng.

- **Quy trình Quản lý kho, Dự báo AI và Duyệt đơn nhập hàng:**
  Hằng ngày, nhân viên kho theo dõi số lượng hàng thực tế trên giao diện quản lý hoặc bấm nút "Kích hoạt kiểm tra AI". Hệ thống Backend sẽ tự động tổng hợp lịch sử xuất/bán hàng trong 30 ngày qua và gửi sang dịch vụ AI (FastAPI). AI tính toán mức tồn kho an toàn và điểm đặt hàng lại có xét đến yếu tố thời tiết, mùa vụ. Nếu số lượng tồn kho chạm ngưỡng cảnh báo, AI sẽ tự động tạo một "Đề xuất nhập hàng" (ở trạng thái Bản nháp - DRAFT) với số lượng đề xuất và lý do cụ thể. Quản trị viên (Admin) xem lại đề xuất, nếu đồng ý sẽ bấm "Phê duyệt". Ngay lập tức, hệ thống tự động sinh phiếu nhập kho (giao dịch loại IN), tự cộng dồn số lượng tồn kho mới của sản phẩm mà không cần nhân viên phải nhập tay phức tạp.

- **Quy trình Mua sắm sản phẩm bán lẻ:**
  Khách hàng xem danh mục các sản phẩm phụ kiện, thức ăn, cát vệ sinh trên trang web và tiến hành đặt mua. Đơn hàng được lưu vào hệ thống, khi thanh toán thành công, số lượng hàng tồn kho tương ứng của các sản phẩm sẽ được tự động trừ đi thông qua một giao dịch xuất kho (loại OUT).

### 2.3.4. Mô hình cơ sở dữ liệu trên hệ thống
Hệ thống sử dụng cơ sở dữ liệu MongoDB thông qua công cụ ánh xạ Prisma ORM, bao gồm 10 bảng dữ liệu (Model) chính được thiết kế tinh gọn và liên kết chặt chẽ:

| Tên Bảng (Model) | Ý Nghĩa Lưu Trữ | Các Thông Tin Chính | Mối Quan Hệ Liên Kết |
| :--- | :--- | :--- | :--- |
| **User** | Tài khoản người dùng | Họ tên, email, mật khẩu mã hóa, số điện thoại, vai trò (Role: CUSTOMER, CARE_STAFF, WAREHOUSE_STAFF, ADMIN). | Một người dùng có nhiều thú cưng, nhiều lịch hẹn và nhiều đơn hàng. |
| **Pet** | Hồ sơ thú cưng | Tên bé, giống loài, tuổi theo tháng, cân nặng, tiền sử bệnh án, chủ sở hữu. | Thuộc về một người dùng (User); có nhiều lịch hẹn dịch vụ. |
| **ServiceCatalog** | Bảng giá dịch vụ | Tên dịch vụ (Spa, Tiêm phòng, Khám), giá tiền, thời gian làm, mô tả. | Một dịch vụ có thể xuất hiện trong nhiều lịch hẹn khác nhau. |
| **Appointment** | Ca hẹn dịch vụ | Ngày hẹn, khung giờ, thú cưng, khách hàng, nhân viên làm, trạng thái và nhật ký chăm sóc. | Liên kết với Pet, User và ServiceCatalog. |
| **Supplier** | Nhà cung cấp | Tên công ty, người liên hệ, số điện thoại, địa chỉ kho hàng. | Cung cấp một hoặc nhiều loại sản phẩm. |
| **Product** | Hàng hóa, vật tư spa | Tên sản phẩm, mã SKU, giá bán, giá vốn, số lượng tồn kho, mức tối thiểu/tối đa. | Thuộc về Supplier; có nhiều giao dịch kho và đề xuất nhập hàng. |
| **StockTransaction** | Lịch sử biến động kho | Loại giao dịch (Nhập kho, Xuất kho, Điều chỉnh), số lượng, ghi chú lý do. | Ghi nhận biến động cho một sản phẩm cụ thể. |
| **Order** | Đơn hàng mua sắm | Khách hàng mua, tổng tiền thanh toán, trạng thái đơn (Chờ xử lý, Đã thanh toán, Hoàn tất). | Thuộc về User; chứa nhiều chi tiết món hàng (OrderItem). |
| **OrderItem** | Chi tiết món hàng trong đơn | Mã sản phẩm, số lượng mua, đơn giá tại thời điểm bán. | Liên kết giữa Order và Product. |
| **ReorderProposal** | Đề xuất nhập hàng của AI | Sản phẩm cần nhập, số lượng gợi ý, lý do AI đề xuất, độ tin cậy và trạng thái duyệt. | Thuộc về Product cần nhập hàng. |

---

## 2.4. CÁC CÔNG NGHỆ VÀ CÔNG CỤ PHÁT TRIỂN PHẦN MỀM

Hệ thống được xây dựng trên các công nghệ hiện đại, bám sát thực tế mã nguồn:

- **Node.js và Express.js (Máy chủ Backend chính):** Đảm nhiệm việc xây dựng hệ thống API chuẩn RESTful, xử lý toàn bộ logic nghiệp vụ như đặt lịch, quản lý kho, tạo đơn hàng và bảo mật hệ thống bằng cơ chế xác thực JWT (JSON Web Token) kết hợp mã hóa mật khẩu Bcrypt.
- **Python và FastAPI (Dịch vụ AI dự báo):** Máy chủ chuyên biệt chạy trên cổng 8000, tận dụng tốc độ cao của FastAPI để tiếp nhận dữ liệu kho từ Node.js, tính toán các công thức tồn kho an toàn và chạy mô hình học máy một cách độc lập mà không làm chậm máy chủ chính.
- **ReactJS và Vite (Giao diện Frontend):** Xây dựng trang web dạng Single Page Application (SPA) mượt mà, tải trang cực nhanh nhờ công cụ đóng gói Vite. Giao diện được thiết kế theo phong cách hiện đại với hiệu ứng trong suốt mờ ảo (Glassmorphism) và bộ icon trực quan Lucide Icons.
- **MongoDB và Prisma ORM (Cơ sở dữ liệu):** MongoDB 7.0 lưu trữ dữ liệu dạng tài liệu JSON/BSON linh hoạt, rất phù hợp với hồ sơ bệnh án và nhật ký chăm sóc thú cưng có cấu trúc đa dạng. Prisma ORM giúp việc truy vấn dữ liệu từ Node.js trở nên an toàn, chính xác và ngăn ngừa các lỗi sai kiểu dữ liệu.
- **Scikit-Learn, Pandas và NumPy (Khoa học dữ liệu & Học máy):** Cung cấp thuật toán Hồi quy rừng ngẫu nhiên (Random Forest Regressor) với 50 cây quyết định để học từ dữ liệu quá khứ và dự báo doanh thu, số lượt dịch vụ trong 6 tháng tới. Pandas và NumPy hỗ trợ chuẩn bị dữ liệu và tính toán độ lệch chuẩn tiêu thụ hàng hóa.
- **Docker và Docker Compose (Đóng gói và Triển khai):** Đóng gói toàn bộ 5 dịch vụ của hệ thống (MongoDB, Mongo Express, Backend API, AI Service, Frontend) vào các container độc lập. Người dùng hoặc người chấm đồ án chỉ cần chạy một câu lệnh duy nhất là toàn bộ hệ thống sẽ tự động khởi động đồng bộ.

---

## 2.5. TỔNG KẾT CHƯƠNG 2

Chương 2 đã trình bày một cách cô đọng, dễ hiểu nhưng đầy đủ toàn bộ nền tảng lý thuyết và công nghệ thực tế được áp dụng trong hệ thống quản lý dịch vụ thú cưng. Từ các công thức quản trị kho khoa học (Tồn kho an toàn, Điểm đặt hàng lại có tính đến mùa vụ thời tiết), giải thuật học máy Random Forest Regressor dự báo xu hướng, cho đến phương pháp thiết kế phần mềm trực quan bằng UML, BPMN và cấu trúc 10 bảng dữ liệu trong MongoDB. Việc kết hợp nhịp nhàng giữa Node.js, ReactJS, Python FastAPI và Docker đã tạo nên một kiến trúc phần mềm hiện đại, chạy mượt mà và thực tế, làm cơ sở vững chắc cho việc thiết kế chi tiết và xây dựng các chức năng ở Chương 3.
