import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

doc = docx.Document()

# Page setup: A4, standard thesis margins (Top: 2cm, Bottom: 2cm, Left: 3cm, Right: 2cm)
sections = doc.sections
for section in sections:
    section.page_width = Inches(8.27)
    section.page_height = Inches(11.69)
    section.top_margin = Inches(0.79)     # 2.0 cm
    section.bottom_margin = Inches(0.79)  # 2.0 cm
    section.left_margin = Inches(1.18)    # 3.0 cm
    section.right_margin = Inches(0.79)   # 2.0 cm

# Helper formatting
def set_font(run, font_name="Times New Roman", size_pt=13, bold=False, italic=False, color=None):
    run.font.name = font_name
    run.font.size = Pt(size_pt)
    run.bold = bold
    run.italic = italic
    if color:
        run.font.color.rgb = color

def add_para(doc, text="", bold=False, italic=False, size_pt=13, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6, space_before=0, first_indent=0.5, line_spacing=1.3):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.line_spacing = line_spacing
    if first_indent > 0:
        p.paragraph_format.first_line_indent = Inches(first_indent)
    if text:
        r = p.add_run(text)
        set_font(r, size_pt=size_pt, bold=bold, italic=italic)
    return p

def add_heading_1(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    set_font(r, size_pt=14, bold=True, color=RGBColor(0, 32, 96))
    return p

def add_heading_2(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    set_font(r, size_pt=13, bold=True, color=RGBColor(31, 78, 121))
    return p

def add_heading_3(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    set_font(r, size_pt=13, bold=True, italic=True)
    return p

def add_bullet(doc, text, bold_prefix="", level=0):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.line_spacing = 1.3
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    if bold_prefix:
        r1 = p.add_run(bold_prefix)
        set_font(r1, size_pt=13, bold=True)
    r2 = p.add_run(text)
    set_font(r2, size_pt=13)
    return p

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_table_borders(table, color="D3D3D3", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:left w:val="none"/>
            <w:right w:val="none"/>
            <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideV w:val="none"/>
        </w:tblBorders>
    ''')
    tblPr.append(borders)

def add_callout(doc, formula_text, label=""):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(6)
    
    r = p.add_run(formula_text)
    set_font(r, size_pt=13, bold=True, italic=True)
    if label:
        r2 = p.add_run(f"    ({label})")
        set_font(r2, size_pt=12, italic=True)

# ----------------- NỘI DUNG CHƯƠNG 2 -----------------

# Tiêu đề Chương 2
p_chap = doc.add_paragraph()
p_chap.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_chap.paragraph_format.space_before = Pt(12)
p_chap.paragraph_format.space_after = Pt(18)
r_chap = p_chap.add_run("CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ SỬ DỤNG")
set_font(r_chap, size_pt=16, bold=True, color=RGBColor(0, 32, 96))

# 2.1
add_heading_1(doc, "2.1. TỔNG QUAN HỆ THỐNG QUẢN LÝ DỊCH VỤ CHĂM SÓC THÚ CƯNG")

add_para(doc, "Hệ thống quản lý dịch vụ chăm sóc thú cưng (Pet Care Management System) là một giải pháp công nghệ thông tin tích hợp toàn diện, được thiết kế chuyên biệt nhằm chuẩn hóa, tự động hóa và tối ưu hóa toàn bộ các hoạt động vận hành tại các cơ sở kinh doanh thú cưng—từ phòng khám thú y, trung tâm spa grooming, khách sạn lưu trú (pet boarding) cho đến các cửa hàng bán lẻ vật phẩm, thức ăn và thuốc chuyên dụng.")

add_para(doc, "Khác với các hệ thống phần mềm quản lý bán hàng thông thường (Point of Sale - POS) chỉ tập trung vào việc thanh toán hóa đơn tại quầy, hệ thống quản lý dịch vụ thú cưng mang tính chất đặc thù cao bởi sự kết hợp đồng thời giữa nghiệp vụ dịch vụ chuyên môn (đặt lịch hẹn trực tuyến, phân công kỹ thuật viên theo khung thời gian thực, quản lý bệnh án và hồ sơ sinh học thú cưng) và chuỗi cung ứng thương mại điện tử (quản lý tồn kho hàng hóa, kiểm soát vật tư tiêu hao spa/y tế, và dự báo nhu cầu tiêu thụ định lượng bằng trí tuệ nhân tạo). Hệ thống đóng vai trò như một \"trung tâm điều hành số\", đồng bộ hóa dòng thông tin và dòng công việc giữa bốn chủ thể then chốt: Khách hàng (Customer), Nhân viên chăm sóc/Kỹ thuật viên Spa (Care Staff), Nhân viên kho (Warehouse Staff) và Quản trị viên/Chủ cơ sở (Admin).")

# 2.1.1
add_heading_2(doc, "2.1.1. Vai trò của hệ thống quản lý dịch vụ thú cưng và chuỗi cung ứng vật tư")

add_heading_3(doc, "Bối cảnh thị trường và thực trạng vận hành")
add_para(doc, "Cùng với xu hướng \"Pet Humanization\" (coi thú cưng như thành viên trong gia đình), nhu cầu chăm sóc sức khỏe, làm đẹp (spa, grooming) và dinh dưỡng cho thú cưng tăng trưởng mạnh mẽ. Tuy nhiên, phần lớn cơ sở vừa và nhỏ hiện nay vẫn vận hành thủ công và đối mặt với các hạn chế lớn:")
add_bullet(doc, "Đặt lịch qua tin nhắn hoặc sổ tay dễ gây trùng ca (Double Booking), quá tải giờ cao điểm nhưng lại lãng phí thời gian trống trong tuần.", "• Tiếp nhận dịch vụ phân mảnh: ")
add_bullet(doc, "Thú cưng chờ đợi lâu trong không gian chung dễ bị căng thẳng (stress) và tăng nguy cơ lây lan mầm bệnh chéo.", "• Dồn ứ và nguy cơ lây nhiễm chéo: ")
add_bullet(doc, "Quản lý kho thủ công khiến cơ sở dễ rơi vào tình trạng \"thủng kho\" (hết sữa tắm, thuốc điều trị làm gián đoạn dịch vụ) hoặc \"ứ đọng vốn\" (nhập thừa hàng cận hạn sử dụng).", "• Thất thoát và đứt gãy vật tư: ")
add_bullet(doc, "Thiếu bệnh án điện tử tập trung khiến nhân viên khó theo dõi tiền sử bệnh, dị ứng hay thói quen của thú cưng.", "• Hồ sơ chăm sóc ngắt quãng: ")

add_heading_3(doc, "Vai trò đối với Khách hàng (Customer)")
add_bullet(doc, "Đặt lịch hẹn trực tuyến 24/7 theo khung giờ trống thực tế (Slot rảnh), tra cứu giá minh bạch và chọn nhân viên yêu thích.", "• Chủ động thời gian: ")
add_bullet(doc, "Lưu trữ trọn đời thể trạng, lịch sử tiêm chủng và nhật ký dịch vụ của từng thú cưng trên cùng một tài khoản.", "• Hồ sơ thú cưng số hóa: ")
add_bullet(doc, "Tích hợp giỏ hàng mua sắm thức ăn, phụ kiện chính hãng kèm dịch vụ trong một lần giao dịch.", "• Mua sắm tiện lợi: ")

add_heading_3(doc, "Vai trò đối với Cơ sở kinh doanh và Nhân viên vận hành")
add_bullet(doc, "Thuật toán khóa slot thời gian thực giúp phân bổ công việc đều đặn cho kỹ thuật viên, loại bỏ hoàn toàn trùng ca.", "• Tối ưu năng suất, chống trùng lịch: ")
add_bullet(doc, "Cho phép kỹ thuật viên ghi chú lâm sàng (Care Summary) sau mỗi ca hẹn, giúp nâng cao tính chuyên nghiệp và giữ chân khách hàng.", "• Cải thiện chất lượng dịch vụ: ")
add_bullet(doc, "Phân tích doanh thu đa kênh (Dịch vụ và Bán lẻ), hỗ trợ theo dõi biên lợi nhuận và định giá chính xác.", "• Kiểm soát tài chính minh bạch: ")

add_heading_3(doc, "Vai trò đối với Chuỗi cung ứng và Quản trị kho thông minh")
add_bullet(doc, "Thiết lập cơ chế giám sát tồn kho liên tục, thay thế phương thức kiểm kê thụ động.", "• Chủ động kiểm soát tồn kho: ")
add_bullet(doc, "Ứng dụng mô hình học máy kết hợp yếu tố mùa vụ và thời tiết để tính toán mức Tồn kho an toàn (Safety Stock) và Điểm đặt hàng lại (Reorder Point), tự động đề xuất đơn nhập hàng thông minh, chống đứt gãy chuỗi cung ứng.", "• Dự báo nhu cầu bằng Trí tuệ nhân tạo (AI): ")

# 2.1.2
add_heading_2(doc, "2.1.2. Các chức năng cốt lõi của hệ thống quản lý dịch vụ thú cưng")
add_para(doc, "Hệ thống phân chia quyền hạn rõ ràng cho 4 vai trò (Khách hàng, Nhân viên chăm sóc, Nhân viên kho, Quản trị viên) với 7 phân hệ chức năng chính:")

add_bullet(doc, "Lưu trữ thông tin chi tiết từng bé thú cưng (tên, giống loài, tuổi, cân nặng, tiền sử bệnh án, dị ứng) và theo dõi lịch sử dịch vụ trọn đời.", "• Quản lý hồ sơ thú cưng: ")
add_bullet(doc, "Khách hàng chọn dịch vụ (tắm spa, cắt tỉa lông, tiêm phòng) và chọn khung giờ còn trống. Hệ thống tự động khóa khung giờ đã kín để tránh trùng lịch hẹn.", "• Đặt lịch hẹn thông minh: ")
add_bullet(doc, "Khách hàng đặt mua thức ăn, phụ kiện, thuốc điều trị có áp mã giảm giá; hệ thống tự động trừ số lượng hàng trong kho ngay khi đơn hàng hoàn tất.", "• Mua sắm sản phẩm trực tuyến: ")
add_bullet(doc, "Theo dõi các hoạt động nhập - xuất - điều chỉnh tồn kho của từng sản phẩm, tự động phát cảnh báo khi hàng chạm mức tối thiểu để kịp thời bổ sung.", "• Quản lý kho hàng: ")
add_bullet(doc, "Dựa vào tốc độ tiêu thụ và yếu tố thời tiết/mùa vụ (nắng nóng, mùa mưa, dịp Lễ Tết) để tính toán và gợi ý số lượng cần nhập kho, giúp cửa hàng không bị đứt hàng và không bị đọng vốn.", "• Dự báo nhập hàng bằng AI: ")
add_bullet(doc, "Cung cấp biểu đồ doanh thu trực quan, phân tích tỷ trọng giữa mảng dịch vụ và bán lẻ, giúp chủ cơ sở nắm bắt tình hình kinh doanh dễ dàng.", "• Báo cáo và Thống kê: ")
add_bullet(doc, "Phân chia quyền thao tác đúng vai trò công việc và bảo vệ an toàn thông tin tài khoản người dùng bằng cơ chế mã hóa hiện đại.", "• Phân quyền và Bảo mật: ")

# Bảng ánh xạ
p_tbl_lbl = doc.add_paragraph()
p_tbl_lbl.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_tbl_lbl.paragraph_format.space_before = Pt(8)
p_tbl_lbl.paragraph_format.space_after = Pt(4)
r_lbl = p_tbl_lbl.add_run("Bảng 2.1. Bảng tổng hợp ánh xạ Tác nhân và Phân hệ chức năng trong hệ thống")
set_font(r_lbl, size_pt=12, bold=True, italic=True)

table_data = [
    ["Tác nhân (Actor)", "Phân hệ tương tác chính", "Thẩm quyền & Hành động nghiệp vụ", "Giá trị mang lại"],
    ["Khách vãng lai (Guest)", "Trang chủ & Danh mục", "Tra cứu dịch vụ, xem sản phẩm, đăng ký tài khoản mới.", "Tiếp cận và mở rộng tệp khách hàng tiềm năng."],
    ["Khách hàng (Customer)", "Hồ sơ thú cưng, Đặt lịch hẹn, Mua sắm E-Commerce", "Quản lý lý lịch thú cưng, đặt lịch theo slot rảnh, mua hàng, xem nhật ký chăm sóc.", "Trải nghiệm tiện lợi, chủ động thời gian, dữ liệu thú cưng trọn đời."],
    ["Nhân viên chăm sóc (Care Staff)", "Hàng đợi ca hẹn, Nhật ký dịch vụ", "Xem ca hẹn được phân công, cập nhật trạng thái làm việc, nhập tóm tắt thể trạng thú cưng sau dịch vụ.", "Tối ưu năng suất lao động, chuyên nghiệp hóa chăm sóc khách hàng."],
    ["Nhân viên kho (Warehouse Staff)", "Quản lý tồn kho, Xuất / Nhập / Kiểm kê, Kích hoạt AI", "Cập nhật số lượng vật tư, nhập kho nhà cung cấp, theo dõi cảnh báo thủng kho, gửi yêu cầu phân tích AI.", "Duy trì liên tục vật tư spa/y tế, chống thất thoát hàng hóa."],
    ["Quản trị viên (Admin)", "Dashboard toàn cảnh, Phân quyền, Bảng giá, Duyệt đề xuất AI", "Quản trị người dùng, điều chỉnh bảng giá dịch vụ, phê duyệt đơn nhập hàng từ AI, xem báo cáo KPI.", "Ra quyết định dựa trên dữ liệu định lượng, tối ưu biên lợi nhuận và vốn."]
]

table = doc.add_table(rows=len(table_data), cols=4)
table.alignment = WD_TABLE_ALIGNMENT.CENTER
set_table_borders(table)

col_widths = [Inches(1.5), Inches(1.8), Inches(2.2), Inches(1.8)]

for row_idx, row in enumerate(table.rows):
    is_header = (row_idx == 0)
    for col_idx, cell in enumerate(row.cells):
        cell.width = col_widths[col_idx]
        set_cell_margins(cell, top=120, bottom=120, left=140, right=140)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        if is_header:
            set_cell_background(cell, "002060")
        else:
            if row_idx % 2 == 1:
                set_cell_background(cell, "F2F2F2")
            else:
                set_cell_background(cell, "FFFFFF")
        
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if is_header else WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = 1.15
        
        r = p.add_run(table_data[row_idx][col_idx])
        if is_header:
            set_font(r, size_pt=11, bold=True, color=RGBColor(255, 255, 255))
        else:
            set_font(r, size_pt=11, bold=(col_idx == 0))

doc.add_paragraph().paragraph_format.space_after = Pt(6)

# 2.2
add_heading_1(doc, "2.2. CÁC KHÁI NIỆM VÀ MÔ HÌNH LÝ THUYẾT LIÊN QUAN")

add_heading_2(doc, "2.2.1. Hệ thống thông tin quản lý (MIS) trong vận hành PetCare")
add_para(doc, "Hệ thống thông tin quản lý (MIS) trong đề tài được hiểu đơn giản là một phần mềm web giúp số hóa toàn bộ hoạt động của cửa hàng thú cưng lên cùng một hệ thống duy nhất:")
add_bullet(doc, "Thay vì ghi chép lịch hẹn vào sổ tay hay quản lý hàng hóa bằng file Excel rời rạc dễ thất lạc, toàn bộ dữ liệu của 4 nhóm người dùng (Khách hàng, Nhân viên chăm sóc, Nhân viên kho, Quản trị viên) được liên kết chặt chẽ với nhau.", "• Quản lý tập trung: ")
add_bullet(doc, "Khi khách hàng đặt lịch spa, nhân viên chăm sóc lập tức thấy lịch trong hàng đợi; khi khách mua sản phẩm, nhân viên kho thấy số lượng tồn kho tự động giảm đi, và người quản lý có thể xem doanh thu tổng hợp ngay trên bảng điều khiển.", "• Đồng bộ dữ liệu tức thời: ")

add_heading_2(doc, "2.2.2. Cơ sở dữ liệu NoSQL (MongoDB)")
add_para(doc, "Hệ thống lựa chọn cơ sở dữ liệu phi quan hệ MongoDB để lưu trữ toàn bộ thông tin của cửa hàng vì các lý do thực tế sau:")
add_bullet(doc, "Mỗi bé thú cưng có thể có giống loài khác nhau, cân nặng, tiền sử bệnh án hoặc dị ứng khác nhau; mỗi đơn hàng lại có danh sách nhiều sản phẩm con khác nhau. MongoDB lưu dữ liệu dưới dạng tài liệu (Document) giống như file JSON, giúp việc lưu trữ và thay đổi thông tin diễn ra rất tự nhiên và thuận tiện.", "• Dữ liệu linh hoạt: ")
add_bullet(doc, "Dữ liệu lịch hẹn, nhật ký chăm sóc và thông tin thú cưng có thể đọc và ghi nhanh chóng mà không cần các câu lệnh nối bảng (JOIN) phức tạp, giúp các trang Dashboard của nhân viên tải dữ liệu mượt mà.", "• Tốc độ truy xuất nhanh: ")

add_heading_2(doc, "2.2.3. Kiến trúc phần mềm phân tầng kết hợp Microservice")
add_para(doc, "Hệ thống được xây dựng kết hợp giữa kiến trúc phân tầng rõ ràng ở máy chủ chính và một dịch vụ AI độc lập:")
add_bullet(doc, "Là trang web trực quan xây dựng bằng ReactJS & Vite, nơi khách hàng đặt lịch, mua sắm và nhân viên thao tác quản lý.", "• Giao diện người dùng (Frontend): ")
add_bullet(doc, "Xây dựng bằng Node.js Express & Prisma ORM, chịu trách nhiệm xử lý các nghiệp vụ đăng nhập, đặt lịch, thanh toán và kết nối cơ sở dữ liệu MongoDB an toàn kiểu dữ liệu.", "• Máy chủ nghiệp vụ chính (Backend): ")
add_bullet(doc, "Xây dựng bằng Python FastAPI chạy độc lập trên cổng 8000. Do các tác vụ huấn luyện học máy và tính toán số liệu thống kê tiêu tốn nhiều tài nguyên, việc để Python chạy riêng giúp máy chủ chính Node.js luôn phản hồi nhanh, không bị đơ giật. Hai máy chủ giao tiếp với nhau qua chuẩn API (HTTP/JSON).", "• Dịch vụ AI dự báo độc lập (AI Microservice): ")

add_heading_2(doc, "2.2.4. Quản trị tồn kho: Điểm đặt hàng lại (ROP) và Tồn kho an toàn (Safety Stock)")
add_para(doc, "Trong phân hệ kho của web, nhân viên có thể bấm nút \"Kích hoạt kiểm tra AI\". Hệ thống sẽ dựa vào lịch sử bán hàng 30 ngày gần nhất để tính toán khoa học việc nhập hàng theo 2 công thức:")

add_heading_3(doc, "1. Tồn kho an toàn (Safety Stock - SS)")
add_para(doc, "Là lượng hàng dự phòng lưu sẵn trong kho để phòng ngừa những ngày khách mua tăng đột biến hoặc nhà cung cấp giao hàng trễ:")
add_callout(doc, "SS = Z × σd × √L", "Công thức 2.1")
add_para(doc, "Trong đó: Z = 1.65 (hệ số tin cậy tương ứng với mức độ đáp ứng 95% nhu cầu khách hàng); σd là độ lệch chuẩn lượng tiêu thụ hàng ngày (đo mức độ biến động bán hàng trong 30 ngày qua); L là thời gian chờ nhà cung cấp giao hàng (Lead Time, mặc định hệ thống cài đặt là 5 ngày).")

add_heading_3(doc, "2. Điểm đặt hàng lại (Reorder Point - ROP)")
add_para(doc, "Là mức số lượng tồn kho mà khi hàng thực tế giảm xuống bằng hoặc thấp hơn mức này, hệ thống sẽ tự động phát sinh đề xuất nhập hàng:")
add_callout(doc, "ROP = (Nhu cầu bán trung bình ngày × Số ngày chờ hàng) + Tồn kho an toàn", "Công thức 2.2")

add_heading_3(doc, "3. Đề xuất số lượng cần nhập")
add_para(doc, "Khi tồn kho thực tế rớt xuống dưới điểm ROP (hoặc dưới mức tối thiểu cài đặt), hệ thống sẽ tự động gợi ý: Số lượng đề xuất nhập = Mức tồn kho tối đa - Số lượng hiện có trong kho. Đề xuất này xuất hiện trên màn hình của Quản trị viên (Admin) kèm lý do rõ ràng để Admin bấm duyệt nhập kho.")

add_heading_2(doc, "2.2.5. Dự báo nhu cầu theo mùa vụ và thời tiết")
add_para(doc, "Trên thực tế tại cơ sở thú cưng, nhu cầu làm đẹp và mua sắm chịu ảnh hưởng rất lớn theo thời tiết và các dịp lễ trong năm. Hệ thống phân tích chu kỳ dữ liệu thành 3 mùa rõ rệt:")
add_bullet(doc, "Nhiệt độ cao (34°C - 38°C), thú cưng dễ bị nóng bức nên nhu cầu tắm mát, cắt tỉa lông (Grooming) và mua sữa tắm dưỡng lông tăng cao (khoảng +48%).", "• Mùa Nắng Nóng (Tháng 4 đến Tháng 8): ")
add_bullet(doc, "Mưa nhiều, độ ẩm không khí cao làm thú cưng dễ bị nấm da, ve rận, viêm tai; nhu cầu khám da liễu, mua thuốc trị nấm, xịt khử khuẩn và cát vệ sinh tăng mạnh (khoảng +35%).", "• Mùa Mưa (Tháng 9 đến Tháng 11): ")
add_bullet(doc, "Khách hàng có nhu cầu làm đẹp cho thú cưng đón năm mới và gửi thú cưng vào khách sạn lưu trú (Pet Hotel) khi đi du lịch hoặc về quê, khiến doanh thu dịch vụ đạt đỉnh cao nhất trong năm (+80%).", "• Dịp Lễ Tết và Cuối năm (Tháng 12 đến Tháng 2): ")

add_heading_2(doc, "2.2.6. Mô hình Rừng ngẫu nhiên (Random Forest Regressor)")
add_para(doc, "Trong dịch vụ AI của hệ thống (ai-service/main.py), mô hình học máy Random Forest Regressor (thuộc thư viện Scikit-Learn) được áp dụng để dự báo số liệu kinh doanh:")
add_bullet(doc, "Thay vì chỉ dùng một cây quyết định đơn lẻ dễ đoán sai, thuật toán kết hợp nhiều cây quyết định độc lập (hệ thống cài đặt 50 cây). Mỗi cây tự học từ các số liệu quá khứ (năm, tháng, nhiệt độ, lượng mưa, mùa vụ) rồi đưa ra kết quả riêng. Cuối cùng, mô hình lấy giá trị trung bình của tất cả các cây để ra con số dự đoán đáng tin cậy nhất.", "• Cách hoạt động dễ hiểu: ")
add_bullet(doc, "Mô hình giúp dự báo trước cho 6 tháng tới về: Doanh thu dự kiến, số lượng khách sẽ đặt dịch vụ spa, và số lượng sản phẩm bán ra. Nhờ đó, người quản lý có thể chủ động sắp xếp thêm nhân viên trước mùa cao điểm và chuẩn bị vốn nhập hàng đúng thời điểm.", "• Ứng dụng trên web: ")

# 2.3
add_heading_1(doc, "2.3. PHƯƠNG PHÁP PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG")

add_heading_2(doc, "2.3.1. Ngôn ngữ mô hình hóa thống nhất (UML)")
add_para(doc, "UML (Unified Modeling Language) là bộ công cụ chuẩn hóa bằng sơ đồ trực quan, giúp người lập trình và các bên liên quan dễ dàng hình dung kiến trúc, chức năng và luồng dữ liệu của hệ thống web trước khi viết mã nguồn. Trong đề tài, các sơ đồ UML được áp dụng gồm:")
add_bullet(doc, "Thể hiện rõ các tác nhân tham gia vào trang web (Khách hàng, Nhân viên chăm sóc, Nhân viên kho, Quản trị viên) và các quyền hạn, chức năng mà từng người được phép thao tác.", "• Biểu đồ Use Case (Use Case Diagram): ")
add_bullet(doc, "Mô tả chi tiết từng bước xử lý logic của các nghiệp vụ quan trọng, ví dụ như quy trình đặt lịch (kiểm tra khung giờ rảnh, tự động khóa tránh trùng lịch) hay quy trình AI tính toán đề xuất nhập hàng.", "• Biểu đồ Hoạt động (Activity Diagram): ")
add_bullet(doc, "Mô tả dòng chảy thông tin và thứ tự gọi API theo thời gian giữa giao diện người dùng (ReactJS Frontend), máy chủ nghiệp vụ (Node.js/Express Backend), máy chủ trí tuệ nhân tạo (Python FastAPI) và cơ sở dữ liệu (MongoDB).", "• Biểu đồ Tuần tự (Sequence Diagram): ")
add_bullet(doc, "Thể hiện cấu trúc các thực thể dữ liệu và mối quan hệ liên kết giữa chúng trong cơ sở dữ liệu.", "• Biểu đồ Lớp (Class Diagram) / Mô hình dữ liệu: ")

add_heading_2(doc, "2.3.2. Chuẩn mô hình hóa quy trình nghiệp vụ (BPMN)")
add_para(doc, "BPMN (Business Process Model and Notation) là chuẩn sơ đồ hóa quy trình vận hành thực tế của cửa hàng. Bằng cách phân chia các luồng công việc thành các \"làn bơi\" (Swimlanes) tương ứng với từng vai trò (Khách hàng, Nhân viên, Quản trị viên), BPMN giúp mọi bộ phận hiểu rõ trách nhiệm và các mốc chuyển giao công việc từ lúc bắt đầu cho đến khi hoàn tất dịch vụ.")

add_heading_2(doc, "2.3.3. Các quy trình nghiệp vụ thực tế trên hệ thống")
add_bullet(doc, "Khách hàng đăng nhập vào hệ thống, chọn hồ sơ thú cưng và chọn dịch vụ cần thực hiện (như Tắm spa, Cắt tỉa lông hoặc Khám sức khỏe). Khách chọn ngày và khung giờ còn trống; hệ thống sẽ tự động kiểm tra và khóa tạm thời khung giờ đó để tránh xung đột lịch hẹn. Khi lịch hẹn được tạo, ca hẹn chuyển vào danh sách chờ tiếp nhận của Nhân viên chăm sóc. Nhân viên tiếp nhận ca hẹn, chuyển trạng thái sang \"Đang thực hiện\". Sau khi hoàn tất dịch vụ, nhân viên nhập ghi chú thể trạng và dặn dò chăm sóc (Care Summary), bấm chuyển trạng thái sang \"Hoàn thành\" để hệ thống ghi nhận doanh thu và lưu vào nhật ký sức khỏe của thú cưng.", "• Quy trình Đặt lịch và Thực hiện dịch vụ chăm sóc thú cưng: ")
add_bullet(doc, "Hằng ngày, nhân viên kho theo dõi số lượng hàng thực tế trên giao diện quản lý hoặc bấm nút \"Kích hoạt kiểm tra AI\". Hệ thống Backend sẽ tự động tổng hợp lịch sử xuất/bán hàng trong 30 ngày qua và gửi sang dịch vụ AI (FastAPI). AI tính toán mức tồn kho an toàn và điểm đặt hàng lại có xét đến yếu tố thời tiết, mùa vụ. Nếu số lượng tồn kho chạm ngưỡng cảnh báo, AI sẽ tự động tạo một \"Đề xuất nhập hàng\" (ở trạng thái Bản nháp - DRAFT) với số lượng đề xuất và lý do cụ thể. Quản trị viên (Admin) xem lại đề xuất, nếu đồng ý sẽ bấm \"Phê duyệt\". Ngay lập tức, hệ thống tự động sinh phiếu nhập kho (giao dịch loại IN), tự cộng dồn số lượng tồn kho mới của sản phẩm mà không cần nhân viên phải nhập tay phức tạp.", "• Quy trình Quản lý kho, Dự báo AI và Duyệt đơn nhập hàng: ")
add_bullet(doc, "Khách hàng xem danh mục các sản phẩm phụ kiện, thức ăn, cát vệ sinh trên trang web và tiến hành đặt mua. Đơn hàng được lưu vào hệ thống, khi thanh toán thành công, số lượng hàng tồn kho tương ứng của các sản phẩm sẽ được tự động trừ đi thông qua một giao dịch xuất kho (loại OUT).", "• Quy trình Mua sắm sản phẩm bán lẻ: ")

add_heading_2(doc, "2.3.4. Mô hình cơ sở dữ liệu trên hệ thống")
add_para(doc, "Hệ thống sử dụng cơ sở dữ liệu MongoDB thông qua công cụ ánh xạ Prisma ORM, bao gồm 10 bảng dữ liệu (Model) chính được thiết kế tinh gọn và liên kết chặt chẽ:")

p_tbl_lbl2 = doc.add_paragraph()
p_tbl_lbl2.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_tbl_lbl2.paragraph_format.space_before = Pt(8)
p_tbl_lbl2.paragraph_format.space_after = Pt(4)
r_lbl2 = p_tbl_lbl2.add_run("Bảng 2.2. Danh mục 10 mô hình dữ liệu chính trong hệ thống")
set_font(r_lbl2, size_pt=12, bold=True, italic=True)

schema_data = [
    ["Tên Bảng (Model)", "Ý Nghĩa Lưu Trữ", "Các Thông Tin Chính", "Mối Quan Hệ Liên Kết"],
    ["User", "Tài khoản người dùng", "Họ tên, email, mật khẩu mã hóa, số điện thoại, vai trò (Role: CUSTOMER, CARE_STAFF, WAREHOUSE_STAFF, ADMIN).", "Một người dùng có nhiều thú cưng, nhiều lịch hẹn và nhiều đơn hàng."],
    ["Pet", "Hồ sơ thú cưng", "Tên bé, giống loài, tuổi theo tháng, cân nặng, tiền sử bệnh án, chủ sở hữu.", "Thuộc về một người dùng (User); có nhiều lịch hẹn dịch vụ."],
    ["ServiceCatalog", "Bảng giá dịch vụ", "Tên dịch vụ (Spa, Tiêm phòng, Khám), giá tiền, thời gian làm, mô tả.", "Một dịch vụ có thể xuất hiện trong nhiều lịch hẹn khác nhau."],
    ["Appointment", "Ca hẹn dịch vụ", "Ngày hẹn, khung giờ, thú cưng, khách hàng, nhân viên làm, trạng thái và nhật ký chăm sóc.", "Liên kết với Pet, User và ServiceCatalog."],
    ["Supplier", "Nhà cung cấp", "Tên công ty, người liên hệ, số điện thoại, địa chỉ kho hàng.", "Cung cấp một hoặc nhiều loại sản phẩm."],
    ["Product", "Hàng hóa, vật tư spa", "Tên sản phẩm, mã SKU, giá bán, giá vốn, số lượng tồn kho, mức tối thiểu/tối đa.", "Thuộc về Supplier; có nhiều giao dịch kho và đề xuất nhập hàng."],
    ["StockTransaction", "Lịch sử biến động kho", "Loại giao dịch (Nhập kho, Xuất kho, Điều chỉnh), số lượng, ghi chú lý do.", "Ghi nhận biến động cho một sản phẩm cụ thể."],
    ["Order", "Đơn hàng mua sắm", "Khách hàng mua, tổng tiền thanh toán, trạng thái đơn (Chờ xử lý, Đã thanh toán, Hoàn tất).", "Thuộc về User; chứa nhiều chi tiết món hàng (OrderItem)."],
    ["OrderItem", "Chi tiết món hàng trong đơn", "Mã sản phẩm, số lượng mua, đơn giá tại thời điểm bán.", "Liên kết giữa Order và Product."],
    ["ReorderProposal", "Đề xuất nhập hàng của AI", "Sản phẩm cần nhập, số lượng gợi ý, lý do AI đề xuất, độ tin cậy và trạng thái duyệt.", "Thuộc về Product cần nhập hàng."]
]

table2 = doc.add_table(rows=len(schema_data), cols=4)
table2.alignment = WD_TABLE_ALIGNMENT.CENTER
set_table_borders(table2)

col_widths2 = [Inches(1.5), Inches(1.8), Inches(2.2), Inches(1.7)]

for row_idx, row in enumerate(table2.rows):
    is_header = (row_idx == 0)
    for col_idx, cell in enumerate(row.cells):
        cell.width = col_widths2[col_idx]
        set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        if is_header:
            set_cell_background(cell, "002060")
        else:
            if row_idx % 2 == 1:
                set_cell_background(cell, "F2F2F2")
            else:
                set_cell_background(cell, "FFFFFF")
        
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if is_header else WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = 1.15
        
        r = p.add_run(schema_data[row_idx][col_idx])
        if is_header:
            set_font(r, size_pt=10.5, bold=True, color=RGBColor(255, 255, 255))
        else:
            set_font(r, size_pt=10.5, bold=(col_idx == 0))

doc.add_paragraph().paragraph_format.space_after = Pt(6)

# 2.4
add_heading_1(doc, "2.4. CÁC CÔNG NGHỆ VÀ CÔNG CỤ PHÁT TRIỂN PHẦN MỀM")
add_para(doc, "Hệ thống được xây dựng trên các công nghệ hiện đại, bám sát thực tế mã nguồn:")

add_bullet(doc, "Đảm nhiệm việc xây dựng hệ thống API chuẩn RESTful, xử lý toàn bộ logic nghiệp vụ như đặt lịch, quản lý kho, tạo đơn hàng và bảo mật hệ thống bằng cơ chế xác thực JWT (JSON Web Token) kết hợp mã hóa mật khẩu Bcrypt.", "• Node.js và Express.js (Máy chủ Backend chính): ")
add_bullet(doc, "Máy chủ chuyên biệt chạy trên cổng 8000, tận dụng tốc độ cao của FastAPI để tiếp nhận dữ liệu kho từ Node.js, tính toán các công thức tồn kho an toàn và chạy mô hình học máy một cách độc lập mà không làm chậm máy chủ chính.", "• Python và FastAPI (Dịch vụ AI dự báo): ")
add_bullet(doc, "Xây dựng trang web dạng Single Page Application (SPA) mượt mà, tải trang cực nhanh nhờ công cụ đóng gói Vite. Giao diện được thiết kế theo phong cách hiện đại với hiệu ứng trong suốt mờ ảo (Glassmorphism) và bộ icon trực quan Lucide Icons.", "• ReactJS và Vite (Giao diện Frontend): ")
add_bullet(doc, "MongoDB 7.0 lưu trữ dữ liệu dạng tài liệu JSON/BSON linh hoạt, rất phù hợp với hồ sơ bệnh án và nhật ký chăm sóc thú cưng có cấu trúc đa dạng. Prisma ORM giúp việc truy vấn dữ liệu từ Node.js trở nên an toàn, chính xác và ngăn ngừa các lỗi sai kiểu dữ liệu.", "• MongoDB và Prisma ORM (Cơ sở dữ liệu): ")
add_bullet(doc, "Cung cấp thuật toán Hồi quy rừng ngẫu nhiên (Random Forest Regressor) với 50 cây quyết định để học từ dữ liệu quá khứ và dự báo doanh thu, số lượt dịch vụ trong 6 tháng tới. Pandas và NumPy hỗ trợ chuẩn bị dữ liệu và tính toán độ lệch chuẩn tiêu thụ hàng hóa.", "• Scikit-Learn, Pandas và NumPy (Khoa học dữ liệu & Học máy): ")
add_bullet(doc, "Đóng gói toàn bộ 5 dịch vụ của hệ thống (MongoDB, Mongo Express, Backend API, AI Service, Frontend) vào các container độc lập. Người dùng hoặc người chấm đồ án chỉ cần chạy một câu lệnh duy nhất là toàn bộ hệ thống sẽ tự động khởi động đồng bộ.", "• Docker và Docker Compose (Đóng gói và Triển khai): ")

# 2.5
add_heading_1(doc, "2.5. TỔNG KẾT CHƯƠNG 2")
add_para(doc, "Chương 2 đã trình bày một cách cô đọng, dễ hiểu nhưng đầy đủ toàn bộ nền tảng lý thuyết và công nghệ thực tế được áp dụng trong hệ thống quản lý dịch vụ thú cưng. Từ các công thức quản trị kho khoa học (Tồn kho an toàn, Điểm đặt hàng lại có tính đến mùa vụ thời tiết), giải thuật học máy Random Forest Regressor dự báo xu hướng, cho đến phương pháp thiết kế phần mềm trực quan bằng UML, BPMN và cấu trúc 10 bảng dữ liệu trong MongoDB. Việc kết hợp nhịp nhàng giữa Node.js, ReactJS, Python FastAPI và Docker đã tạo nên một kiến trúc phần mềm hiện đại, chạy mượt mà và thực tế, làm cơ sở vững chắc cho việc thiết kế chi tiết và xây dựng các chức năng ở Chương 3.")

# Lưu file Word
output_path = r"d:\Khoaluantotnghiep\PetCareManagement\CHUONG_2_CO_SO_LY_THUYET.docx"
doc.save(output_path)
print(f"Successfully generated Word document: {output_path}")
