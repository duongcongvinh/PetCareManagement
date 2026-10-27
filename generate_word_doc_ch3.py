import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

doc = docx.Document()

# Page Margins
sections = doc.sections
for s in sections:
    s.top_margin = Inches(0.79)
    s.bottom_margin = Inches(0.79)
    s.left_margin = Inches(1.18)
    s.right_margin = Inches(0.79)

def set_font(run, font_name="Times New Roman", size_pt=13, bold=False, italic=False, color=RGBColor(0,0,0)):
    run.font.name = font_name
    run.font.size = Pt(size_pt)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = color

def add_title(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(12)
    p.paragraph_format.line_spacing = 1.3
    r = p.add_run(text)
    set_font(r, size_pt=16, bold=True, color=RGBColor(0, 32, 96))

def add_heading_1(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.3
    r = p.add_run(text)
    set_font(r, size_pt=14, bold=True, color=RGBColor(0, 32, 96))

def add_heading_2(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.3
    r = p.add_run(text)
    set_font(r, size_pt=13, bold=True, color=RGBColor(0, 32, 96))

def add_heading_3(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.3
    r = p.add_run(text)
    set_font(r, size_pt=13, bold=True, italic=True, color=RGBColor(15, 23, 42))

def add_para(doc, text, first_indent=0.3):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.first_line_indent = Inches(first_indent)
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.3
    r = p.add_run(text)
    set_font(r, size_pt=13)
    return p

def add_bullet(doc, text, prefix="• "):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.left_indent = Inches(0.3)
    p.paragraph_format.first_line_indent = Inches(-0.15)
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.3
    r_pre = p.add_run(prefix)
    set_font(r_pre, size_pt=13, bold=True)
    r_txt = p.add_run(text)
    set_font(r_txt, size_pt=13)

def add_plain_line(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.3)
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    r = p.add_run(text)
    set_font(r, size_pt=13)

# ----------------- BUILD CONTENT -----------------
add_title(doc, "CHƯƠNG 3. PHÂN TÍCH YÊU CẦU HỆ THỐNG")

add_heading_1(doc, "3.1. Khảo sát và phân tích bài toán")

add_heading_2(doc, "3.1.1. Bối cảnh bài toán")
add_para(doc, "Trong những năm gần đây, xu hướng nuôi thú cưng tại các đô thị lớn ở Việt Nam có sự chuyển biến mạnh mẽ. Thú cưng ngày càng được coi như một thành viên thân thiết trong gia đình (hiện tượng \"Pet Humanization\"). Chủ nuôi sẵn sàng chi trả các khoản chi phí định kỳ cho các dịch vụ chăm sóc vệ sinh, làm đẹp (Grooming, Tắm spa, Cắt tỉa tạo kiểu), kiểm tra sức khỏe, tiêm phòng cũng như các sản phẩm dinh dưỡng, phụ kiện chất lượng cao.")
add_para(doc, "Trước nhu cầu thị trường ngày càng lớn, hàng loạt cơ sở spa, phòng khám và cửa hàng thú cưng (Pet Shop) quy mô vừa và nhỏ được mở ra. Tuy nhiên, phần lớn các cơ sở này vẫn đang vận hành theo phương thức truyền thống, phân mảnh giữa khâu cung cấp dịch vụ chăm sóc tại chỗ và khâu bán lẻ vật tư, hàng hóa. Điều này đòi hỏi phải có một giải pháp công nghệ toàn diện giúp tin học hóa quy trình đặt lịch và tối ưu hóa hoạt động chuỗi cung ứng tồn kho.")

add_heading_2(doc, "3.1.2. Thực trạng và nhu cầu")
add_para(doc, "Các hệ thống quản lý dịch vụ hiện nay thường chỉ dừng lại ở các chức năng ghi chép thông tin cơ bản hoặc bán hàng đơn thuần. Tuy nhiên, đối với hệ thống quản lý dịch vụ chăm sóc thú cưng và dự báo nhu cầu nhập hàng thông minh, cần đồng thời xử lý các yếu tố như: hồ sơ thể trạng và bệnh án đa dạng của từng thú cưng, thời lượng từng gói dịch vụ spa/grooming, trạng thái khung giờ rảnh (Slot), nguy cơ đặt trùng ca hẹn, cũng như các biến động tiêu thụ hàng hóa và rủi ro đứt gãy tồn kho theo mùa vụ thời tiết. Vì vậy, việc xác định rõ thực trạng và nhu cầu của từng nhóm người dùng là tiền đề quan trọng để xây dựng quy trình xử lý phù hợp với nghiệp vụ thực tế.")

add_para(doc, "Từ góc độ khách hàng (Customer / Chủ nuôi thú cưng), hệ thống cần đáp ứng các nhu cầu chính:")
add_bullet(doc, "Đăng ký, đăng nhập tài khoản và quản lý thông tin cá nhân.")
add_bullet(doc, "Tạo và cập nhật hồ sơ chi tiết cho từng thú cưng (tên, giống loài, độ tuổi, cân nặng, tiền sử bệnh án và các lưu ý đặc biệt).")
add_bullet(doc, "Tra cứu danh mục dịch vụ chăm sóc (Tắm spa, Cắt tỉa lông, Tiêm phòng, Khám tổng quát), xem trước bảng giá và thời gian thực hiện.")
add_bullet(doc, "Xem lịch trống, chủ động lựa chọn ngày và khung giờ rảnh phù hợp để đặt lịch dịch vụ.")
add_bullet(doc, "Theo dõi trạng thái ca hẹn (Chờ duyệt, Đang thực hiện, Hoàn thành) và xem lại nhật ký dặn dò chăm sóc (Care Summary) sau khi hoàn tất.")
add_bullet(doc, "Xem danh mục sản phẩm (thức ăn, phụ kiện, cát vệ sinh), đặt mua hàng trực tuyến và theo dõi lịch sử đơn hàng.")

add_para(doc, "Từ góc độ nhân viên chăm sóc (Care Staff / Groomer), hệ thống cần hỗ trợ:")
add_bullet(doc, "Xem danh sách các ca hẹn dịch vụ được phân công theo ngày và theo từng khung giờ làm việc.")
add_bullet(doc, "Tra cứu nhanh hồ sơ thể trạng và các lưu ý y tế của thú cưng trước khi tiến hành dịch vụ để đảm bảo an toàn.")
add_bullet(doc, "Cập nhật trạng thái ca hẹn sang \"Đang thực hiện\" khi tiếp nhận thú cưng tại cơ sở.")
add_bullet(doc, "Nhập ghi chú thể trạng, kết quả chăm sóc và dặn dò chủ nuôi (Care Summary) sau khi hoàn thành ca dịch vụ.")
add_bullet(doc, "Theo dõi lịch sử ca làm việc và khối lượng công việc đã hoàn thành.")

add_para(doc, "Từ góc độ nhân viên kho (Warehouse Staff), hệ thống cần hỗ trợ:")
add_bullet(doc, "Quản lý danh mục hàng hóa, vật tư spa kèm mã SKU, giá bán, giá vốn và số lượng tồn kho.")
add_bullet(doc, "Theo dõi biến động số lượng tồn kho theo thời gian thực và nhận cảnh báo khi sản phẩm chạm ngưỡng tồn tối thiểu.")
add_bullet(doc, "Thực hiện và ghi nhận các giao dịch kho (Nhập kho, Xuất kho, Điều chỉnh tồn kho do hư hỏng hoặc hao hụt).")
add_bullet(doc, "Tra cứu danh bạ đối tác cung cấp hàng hóa để chủ động trong công tác liên hệ nhập hàng.")
add_bullet(doc, "Kích hoạt chức năng kiểm tra AI để tiếp nhận các đề xuất nhập hàng tự động dựa trên mức tiêu thụ thực tế.")

add_para(doc, "Từ góc độ quản trị viên (Admin / Chủ cơ sở), hệ thống cần hỗ trợ:")
add_bullet(doc, "Quản lý tài khoản người dùng, phân quyền truy cập và giám sát hoạt động của các bộ phận trong hệ thống.")
add_bullet(doc, "Quản lý danh mục dịch vụ, điều chỉnh thời lượng thực hiện và cập nhật bảng giá linh hoạt.")
add_bullet(doc, "Điều phối, phê duyệt lịch hẹn và chỉ định nhân viên chăm sóc phụ trách từng ca hẹn.")
add_bullet(doc, "Xem xét, phê duyệt hoặc từ chối các đề xuất nhập hàng thông minh (Reorder Proposals) do AI tính toán và tự động cập nhật kho.")
add_bullet(doc, "Theo dõi biểu đồ dự báo doanh thu, số lượng dịch vụ và nhu cầu sản phẩm trong 6 tháng tới từ mô hình học máy Random Forest.")
add_bullet(doc, "Xem các báo cáo thống kê tổng quan về doanh thu dịch vụ, doanh thu bán hàng, tỷ lệ hoàn thành ca hẹn và hiệu suất vận hành toàn diện của cửa hàng.")

add_heading_2(doc, "3.1.3. Phân tích vấn đề cần giải quyết")
add_para(doc, "Từ thực trạng và nhu cầu của khách hàng, nhân viên chăm sóc, nhân viên kho và quản trị viên, hệ thống Quản lý Dịch vụ Thú cưng và Dự báo Nhu cầu Nhập hàng Thông minh cần giải quyết các vấn đề chính sau:")
add_bullet(doc, "Quản lý tập trung thông tin từng thú cưng (giống loài, cân nặng, độ tuổi, tiền sử bệnh án) và danh mục dịch vụ kèm thời lượng thực hiện và mức giá niêm yết một cách thống nhất.", "• Quản lý hồ sơ thú cưng và bảng giá dịch vụ: ")
add_bullet(doc, "Kiểm tra lịch trống, tự động khóa khung giờ (Slot) được chọn theo thời gian thực nhằm ngăn chặn triệt để tình trạng đặt trùng lịch hoặc quá tải.", "• Đảm bảo đặt lịch chính xác và chống trùng lặp: ")
add_bullet(doc, "Theo dõi tiến trình ca hẹn qua các trạng thái (Chờ xác nhận, Đang thực hiện, Hoàn thành), lưu lại tóm tắt chăm sóc (Care Summary) và tình trạng sức khỏe của thú cưng.", "• Quản lý quy trình chăm sóc và nhật ký y bạ: ")
add_bullet(doc, "Quản lý danh mục sản phẩm, xử lý đơn hàng bán lẻ và tự động ghi nhận các giao dịch kho (Nhập, Xuất, Điều chỉnh) để tồn kho luôn chính xác.", "• Quản lý bán lẻ và kiểm soát kho bãi: ")
add_bullet(doc, "Tính toán mức tồn kho an toàn (Safety Stock) và điểm đặt hàng lại (Reorder Point) có xét đến yếu tố thời tiết, tự động phát sinh đề xuất nhập hàng bản nháp.", "• Tự động hóa cảnh báo tồn kho và đề xuất nhập hàng: ")
add_bullet(doc, "Sử dụng mô hình học máy Random Forest Regressor để dự báo doanh thu, số lượt dịch vụ và nhu cầu sản phẩm trong 6 tháng tới theo mùa vụ thời tiết.", "• Ứng dụng AI dự báo nhu cầu kinh doanh theo mùa vụ: ")
add_bullet(doc, "Bảo đảm 4 nhóm đối tượng (Customer, Care Staff, Warehouse Staff và Admin) chỉ được thao tác đúng phạm vi quyền hạn thông qua cơ chế phân quyền RBAC.", "• Quản lý người dùng và phân quyền nghiêm ngặt: ")
add_bullet(doc, "Cung cấp bảng điều khiển (Dashboard) với các biểu đồ trực quan về doanh thu, ca hẹn và cảnh báo cạn kho phục vụ công tác ra quyết định của người quản lý.", "• Quản lý và thống kê dữ liệu trực quan: ")
add_para(doc, "Như vậy, vấn đề trọng tâm của đề tài là xây dựng một hệ thống quản lý dịch vụ chăm sóc thú cưng toàn diện, có khả năng quản lý lịch hẹn dịch vụ theo thời gian thực, bảo đảm tính nhất quán của ca hẹn, phân quyền chặt chẽ giữa các bộ phận, đồng thời tích hợp mô hình học máy (AI) và các công thức quản trị tồn kho nhằm tối ưu hóa chuỗi cung ứng hàng hóa cho cơ sở kinh doanh.")

add_heading_1(doc, "3.2. Phương pháp khảo sát")

add_heading_2(doc, "3.2.1. Đối tượng và phạm vi khảo sát")
add_para(doc, "Khảo sát được thực hiện nhằm thu thập thông tin về nhu cầu, thói quen và những khó khăn của chủ nuôi thú cưng trong quá trình tìm kiếm dịch vụ, lựa chọn khung giờ và đặt lịch chăm sóc (Spa, Tắm tỉa, Khám sức khỏe), cũng như thói quen mua sắm phụ kiện, thức ăn. Bên cạnh đó, đề tài thực hiện khảo sát nhân viên chăm sóc, nhân viên kho và quản trị viên/chủ cơ sở để tìm hiểu quy trình tiếp nhận ca hẹn, ghi nhận y bạ, quản lý tồn kho và bài toán dự báo hàng nhập theo mùa vụ.")
add_bullet(doc, "Tập trung vào nhu cầu tìm kiếm dịch vụ spa/khám bệnh, tiêu chí chọn cơ sở, cách thức đặt lịch, nhu cầu theo dõi hồ sơ sức khỏe của thú cưng và trải nghiệm mua sắm vật tư, phụ kiện.", "• Khách hàng (Chủ nuôi thú cưng): ")
add_bullet(doc, "Tập trung vào quy trình tiếp nhận lịch hẹn, tránh trùng ca, ghi chép nhật ký sau ca làm, quản lý kho hàng, theo dõi biến động xuất nhập tồn và những khó khăn trong việc dự đoán nhu cầu nhập hàng khi thời tiết thay đổi.", "• Nhân viên và Quản lý cơ sở (Care Staff, Warehouse Staff, Admin): ")

add_heading_2(doc, "3.2.2. Phương pháp và cách thu thập thông tin")
add_para(doc, "Đề tài sử dụng kết hợp khảo sát bằng bảng hỏi và phỏng vấn bán cấu trúc để thu thập thông tin:")
add_bullet(doc, "Bảng hỏi được xây dựng dưới dạng trực tuyến (Google Forms) và phát hành thông qua các nhóm cộng đồng nuôi thú cưng (chó, mèo), diễn đàn yêu động vật và khách hàng đang sử dụng dịch vụ tại các pet shop/spa thú cưng. Nội dung khảo sát tập trung vào thói quen đặt lịch, mức độ hài lòng về thời gian chờ đợi, nhu cầu lưu trữ hồ sơ bệnh án của thú cưng và mong muốn tự chọn khung giờ trên trang web.", "• Đối với khách hàng: ")
add_bullet(doc, "Nhóm thực hiện phỏng vấn bán cấu trúc nhằm tìm hiểu quy trình vận hành thực tế tại cửa hàng. Nội dung phỏng vấn tập trung vào cách điều phối thợ chăm sóc, cách kiểm soát khung giờ rảnh, quy trình kiểm kê hàng hóa trên kệ, cách xử lý khi sản phẩm cạn kho và cách thức dự báo lượng hàng cần nhập vào các mùa cao điểm trong năm.", "• Đối với nhân viên và chủ cơ sở: ")
add_para(doc, "Thông tin thu thập được tổng hợp, phân loại theo từng nhóm đối tượng và sử dụng làm cơ sở xác định yêu cầu chức năng, yêu cầu phi chức năng và quy tắc nghiệp vụ của hệ thống.")

add_heading_2(doc, "3.2.3. Nội dung bảng hỏi")
add_para(doc, "Bảng hỏi dành cho khách hàng được chia thành các nhóm câu hỏi chính:")
add_bullet(doc, "Loài thú cưng nuôi (chó, mèo...), độ tuổi, giống loài và tần suất đưa thú cưng đi spa/grooming hoặc khám bệnh định kỳ.", "• Thông tin về thú cưng: ")
add_bullet(doc, "Cách đặt lịch hiện tại (gọi điện, nhắn tin mạng xã hội, đến trực tiếp) và những khó khăn thường gặp (phải chờ đợi lâu, quán bị quá tải, thợ không nắm rõ tính cách thú cưng).", "• Tìm kiếm và đặt lịch dịch vụ: ")
add_bullet(doc, "Bảng giá niêm yết rõ ràng, hiển thị khung giờ còn trống, chất lượng chăm sóc, mức độ an toàn và việc theo dõi lưu ý bệnh án của bé.", "• Tiêu chí lựa chọn dịch vụ: ")
add_bullet(doc, "Tần suất mua thức ăn, cát vệ sinh, thuốc men và các phụ kiện đi kèm khi sử dụng dịch vụ.", "• Nhu cầu mua sắm sản phẩm: ")
add_bullet(doc, "Mức độ cần thiết của việc chủ động chọn lịch hẹn trên web, khóa giờ tránh trùng lịch và xem lại tóm tắt dặn dò của nhân viên sau ca chăm sóc.", "• Đánh giá nhu cầu sử dụng hệ thống: ")

add_para(doc, "Đối với nhân viên và chủ cơ sở, các câu hỏi tập trung vào:")
add_bullet(doc, "Cách quản lý lịch hẹn và phân công thợ chăm sóc hiện tại.")
add_bullet(doc, "Cách ghi nhận đặc điểm thú cưng (dị ứng, hung dữ, tiền sử bệnh) để thợ lưu ý khi làm dịch vụ.")
add_bullet(doc, "Quy trình kiểm kê kho và phát hiện hàng sắp hết.")
add_bullet(doc, "Những khó khăn khi nguồn cung bị đứt đoạn hoặc hàng hóa bị ứ đọng do biến động thời tiết/mùa vụ.")
add_bullet(doc, "Mức độ cần thiết của tính năng AI tự động tính toán điểm đặt hàng lại và gợi ý đơn nhập hàng kèm lý do giải thích.")

add_heading_2(doc, "3.2.4. Tổng hợp và sử dụng kết quả khảo sát")
add_para(doc, "Sau khi thu thập, dữ liệu khảo sát được tổng hợp và phân loại theo từng nhóm nội dung. Đối với các câu hỏi lựa chọn, kết quả được thống kê theo số lượng và tỷ lệ phần trăm. Đối với các câu hỏi mở và nội dung phỏng vấn, nhóm thực hiện tổng hợp các ý kiến có liên quan và phân loại theo từng vấn đề nghiệp vụ.")
add_para(doc, "Kết quả khảo sát được sử dụng để xác định các nhu cầu chính của người dùng, làm cơ sở xây dựng yêu cầu chức năng, yêu cầu phi chức năng, quy tắc nghiệp vụ và quy trình xử lý của hệ thống. Đồng thời, các kết quả liên quan đến chu kỳ tiêu thụ hàng hóa và đặc trưng mùa vụ thời tiết được sử dụng làm cơ sở xây dựng công thức tính tồn kho an toàn (SS, ROP) và huấn luyện mô hình học máy Random Forest Regressor phục vụ dự báo nhu cầu nhập hàng thông minh.")

add_heading_1(doc, "3.3. Quy trình nghiệp vụ hiện tại")

add_heading_2(doc, "3.3.1. Quy trình AS-IS")
add_para(doc, "Hiện nay, việc đặt lịch dịch vụ và quản lý hàng hóa tại các cơ sở chăm sóc thú cưng thường được thực hiện thủ công thông qua các kênh liên lạc như gọi điện thoại, nhắn tin Zalo, Facebook hoặc khách hàng đưa thú cưng đến trực tiếp cửa hàng. Thông tin về lịch hẹn, hồ sơ thú cưng, giá dịch vụ và số lượng hàng tồn kho được quản lý rời rạc bằng sổ ghi chép tay hoặc bảng tính cá nhân.")
add_para(doc, "Sơ đồ quy trình khái quát (Đặt lịch và Chăm sóc): Khách hàng → Liên hệ lễ tân/nhân viên → Kiểm tra sổ lịch → Thông báo khung giờ và giá → Khách hàng xác nhận → Ghi sổ tay → Khách đưa thú cưng đến → Làm dịch vụ → Thanh toán và viết hóa đơn giấy.")
add_para(doc, "Sơ đồ quy trình khái quát (Quản lý kho và Nhập hàng): Thợ/Nhân viên phát hiện cạn hàng trên kệ → Ghi giấy note hoặc nhắn nhóm nội bộ → Chủ cơ sở ước lượng số lượng → Liên hệ nhà cung cấp → Nhà cung cấp giao hàng → Kiểm đếm thủ công → Thanh toán và lưu chứng từ giấy.")

add_heading_2(doc, "3.3.2. Những hạn chế của quy trình AS-IS")
add_bullet(doc, "Khách hàng phải chờ đợi nhân viên kiểm tra sổ sách để biết khung giờ nào còn rảnh, gây mất thời gian của cả hai bên.", "• Kiểm tra lịch thủ công và phản hồi chậm: ")
add_bullet(doc, "Khi nhiều khách cùng nhắn tin đặt một khung giờ, việc ghi sổ tay dễ dẫn đến nhầm lẫn, trùng thợ hoặc quá tải cục bộ, khiến khách đến nơi phải chờ đợi lâu, thú cưng bị căng thẳng.", "• Nguy cơ trùng lịch cao (Overbooking): ")
add_bullet(doc, "Thông tin tiền sử bệnh án, dị ứng thuốc hay tập tính hung dữ không được lưu trữ tập trung. Mỗi lần đổi thợ chăm sóc mới, thông tin này lại bị gián đoạn, dễ phát sinh rủi ro trong lúc thao tác.", "• Thất lạc hồ sơ sức khỏe thú cưng: ")
add_bullet(doc, "Không có cơ chế cảnh báo cạn kho tự động. Cơ sở chỉ phát hiện hết hàng khi kệ đã cạn kiệt, dẫn đến gián đoạn dịch vụ hoặc mất doanh thu bán lẻ.", "• Quản lý kho bị động và dễ đứt gãy hàng hóa: ")
add_bullet(doc, "Việc nhập hàng hoàn toàn dựa trên phán đoán chủ quan, không nắm bắt được chu kỳ biến động theo thời tiết, dẫn đến tình trạng vừa thiếu hàng thiết yếu vừa tồn đọng các mặt hàng khó bán.", "• Nhập hàng theo cảm tính và đọng vốn: ")
add_bullet(doc, "Chủ cơ sở mất nhiều công sức để tính toán đối soát từ các sổ sách giấy tờ, khó nắm bắt kịp thời bức tranh kinh doanh toàn diện.", "• Tổng hợp doanh thu phức tạp: ")

add_heading_2(doc, "3.3.3. Quy trình TO-BE đề xuất")
add_para(doc, "Nhằm khắc phục triệt để các hạn chế của cách làm thủ công cũ, hệ thống đề xuất số hóa toàn bộ quy trình vận hành trên một trang web thống nhất. Mọi hoạt động từ đặt lịch, chăm sóc thú cưng cho đến kiểm tra kho bãi và nhập hàng đều được liên kết nhịp nhàng qua 4 quy trình cụ thể sau:")

add_para(doc, "Quy trình dành cho Khách hàng (Chủ nuôi thú cưng):")
add_bullet(doc, "Khách hàng đăng nhập vào website và tạo hồ sơ cho thú cưng của mình (tên, giống loài, độ tuổi, cân nặng và các lưu ý đặc biệt như dị ứng sữa tắm hay tính cách nhút nhát).", "• Bước 1 - Tạo hồ sơ: ")
add_bullet(doc, "Khách xem danh mục dịch vụ (Tắm spa, Cắt tỉa lông, Tiêm phòng, Khám tổng quát) kèm bảng giá và thời gian thực hiện rõ ràng. Khách chọn ngày mong muốn; lúc này trang web sẽ chỉ hiển thị những khung giờ còn thực sự rảnh.", "• Bước 2 - Chọn dịch vụ và giờ hẹn: ")
add_bullet(doc, "Khi khách bấm chọn một khung giờ, hệ thống sẽ tự động \"khóa\" tạm thời giờ đó lại để không ai khác có thể đặt trùng ca. Lịch hẹn được gửi lên hệ thống ở trạng thái chờ tiếp nhận.", "• Bước 3 - Khóa giờ chống trùng lịch: ")
add_bullet(doc, "Đến ngày hẹn, khách đưa thú cưng đến cơ sở. Sau khi nhân viên hoàn thành dịch vụ, khách nhận lại thú cưng và có thể mở điện thoại xem ngay lời dặn dò, tình trạng da lông và nhật ký sức khỏe của bé được lưu lại trên website.", "• Bước 4 - Trải nghiệm dịch vụ và theo dõi y bạ: ")

add_para(doc, "Quy trình dành cho Nhân viên chăm sóc (Thợ Spa / Groomer):")
add_bullet(doc, "Nhân viên đăng nhập vào hệ thống để xem danh sách các ca hẹn được phân công cho mình trong ngày.", "• Bước 1 - Nhận ca làm việc: ")
add_bullet(doc, "Trước khi làm dịch vụ, nhân viên mở hồ sơ thú cưng để nắm rõ đặc tính của bé để chuẩn bị dụng cụ phù hợp và đảm bảo an toàn.", "• Bước 2 - Xem trước hồ sơ thú cưng: ")
add_bullet(doc, "Khi khách đưa thú cưng đến, nhân viên bấm chuyển trạng thái ca hẹn sang \"Đang thực hiện\" để quản lý biết thợ đang bận.", "• Bước 3 - Thực hiện dịch vụ: ")
add_bullet(doc, "Làm xong dịch vụ, nhân viên nhập một đoạn ghi chú ngắn tóm tắt thể trạng (Care Summary) rồi bấm \"Hoàn thành\". Thông tin này sẽ được lưu vĩnh viễn vào lịch sử của bé thú cưng.", "• Bước 4 - Ghi chú chăm sóc và hoàn thành: ")

add_para(doc, "Quy trình dành cho Quản lý kho và Trí tuệ nhân tạo (AI):")
add_bullet(doc, "Mỗi khi cửa hàng bán được một món đồ hoặc nhân viên dùng vật tư spa, số lượng tồn kho trên hệ thống sẽ tự động giảm đi ngay lập tức.", "• Bước 1 - Theo dõi tồn kho thực tế: ")
add_bullet(doc, "Dịch vụ AI sẽ phân tích lịch sử bán hàng trong 30 ngày qua, kết hợp với các mùa thời tiết thực tế (nắng nóng, mưa ẩm, dịp cận Tết).", "• Bước 2 - AI phân tích và tính toán: ")
add_bullet(doc, "Khi một sản phẩm sắp chạm ngưỡng cạn kho, AI sẽ tự động lập sẵn một \"Đề xuất nhập hàng\" ở dạng bản nháp, gợi ý rõ số lượng cần nhập và giải thích lý do cụ thể.", "• Bước 3 - Tự động tạo đề xuất nhập hàng: ")

add_para(doc, "Quy trình dành cho Quản trị viên (Admin / Chủ cơ sở):")
add_bullet(doc, "Người quản lý theo dõi bảng điều khiển (Dashboard) để nắm bắt lịch hẹn trong ngày, doanh thu và các cảnh báo hàng sắp hết.", "• Bước 1 - Giám sát toàn diện: ")
add_bullet(doc, "Khi thấy thông báo đề xuất nhập hàng từ AI, người quản lý xem lại số lượng và lý do. Nếu đồng ý, quản lý chỉ cần bấm một nút \"Phê duyệt\".", "• Bước 2 - Phê duyệt nhập hàng 1 chạm: ")
add_bullet(doc, "Hệ thống sẽ tự động tạo phiếu nhập kho và tự cộng dồn số lượng hàng mới vào kho mà nhân viên không cần phải lấy sổ sách tính toán cộng trừ bằng tay.", "• Bước 3 - Cập nhật kho tự động: ")
add_bullet(doc, "Người quản lý có thể xem biểu đồ dự báo 6 tháng tới (do AI tính toán) về doanh thu và lượng khách dự kiến để chủ động chuẩn bị vốn nhập hàng và sắp xếp nhân sự.", "• Bước 4 - Định hướng kinh doanh: ")

add_para(doc, "Quy trình Mua sắm sản phẩm bán lẻ: Bên cạnh việc đặt lịch chăm sóc, khách hàng có thể dạo xem danh mục sản phẩm (thức ăn hạt, pate, đồ chơi, cát vệ sinh) và bấm đặt mua trực tuyến trên website. Khi đơn hàng được xác nhận và thanh toán, hệ thống sẽ tự động trừ số lượng hàng trong kho tương ứng.")
add_para(doc, "Ý nghĩa của quy trình TO-BE: Quy trình mới giúp chuyển đổi toàn bộ cách làm việc từ thủ công, bị động sang tự động và chủ động. Khách hàng không còn lo bị trùng lịch hẹn hay phải chờ đợi lâu; nhân viên nắm rõ tình trạng thú cưng để phục vụ chu đáo hơn; và chủ cơ sở luôn kiểm soát tốt kho bãi, không lo hết hàng vào mùa cao điểm cũng không sợ ứ đọng vốn.")

add_heading_1(doc, "3.4.   Yêu cầu hệ thống")

add_heading_2(doc, "3.4.1. Yêu cầu chức năng")
add_para(doc, "Xác định các chức năng (use case) của hệ thống", first_indent=0)

def add_actor_usecases(doc, actor_name, usecases):
    p_act = doc.add_paragraph()
    p_act.paragraph_format.left_indent = Inches(0.2)
    p_act.paragraph_format.space_before = Pt(6)
    p_act.paragraph_format.space_after = Pt(2)
    p_act.paragraph_format.line_spacing = 1.15
    r_act = p_act.add_run(f"➢   {actor_name}")
    set_font(r_act, size_pt=13, bold=True)
    
    for uc in usecases:
        p_uc = doc.add_paragraph()
        p_uc.paragraph_format.left_indent = Inches(0.5)
        p_uc.paragraph_format.space_before = Pt(0)
        p_uc.paragraph_format.space_after = Pt(2)
        p_uc.paragraph_format.line_spacing = 1.15
        r_bullet = p_uc.add_run("•   ")
        set_font(r_bullet, size_pt=13, bold=True)
        r_txt = p_uc.add_run(uc)
        set_font(r_txt, size_pt=13)

add_actor_usecases(doc, "Khách hàng", [
    "Đăng ký",
    "Đăng nhập",
    "Đăng xuất",
    "Quản lý thông tin cá nhân",
    "Quản lý thú cưng",
    "Tìm kiếm thông tin",
    "Xem chi tiết dịch vụ",
    "Đặt lịch hẹn",
    "Hủy lịch hẹn",
    "Xem lịch sử lịch hẹn",
    "Xem nhật ký chăm sóc thú cưng",
    "Đặt mua sản phẩm"
])

add_actor_usecases(doc, "Nhân viên", [
    "Đăng nhập",
    "Đăng xuất",
    "Quản lý lịch hẹn",
    "Xem danh sách ca hẹn được phân công",
    "Tiếp nhận ca hẹn",
    "Cập nhật trạng thái ca hẹn",
    "Ghi chú nhật ký chăm sóc",
    "Quản lý hồ sơ thú cưng",
    "Quản lý dịch vụ",
    "Quản lý chương trình khuyến mãi",
    "Xem báo cáo, thống kê ca làm"
])

add_actor_usecases(doc, "Quản lý kho", [
    "Đăng nhập",
    "Đăng xuất",
    "Quản lý kho (Nhập/Xuất/Tồn kho)",
    "Xem danh sách hàng hóa và tồn kho",
    "Tạo phiếu nhập kho",
    "Tạo phiếu xuất kho",
    "Điều chỉnh tồn kho",
    "Quản lý nhà cung cấp",
    "Dự báo nhu cầu",
    "Kích hoạt kiểm tra AI",
    "Lập đề xuất nhập hàng"
])

add_actor_usecases(doc, "Quản trị viên", [
    "Đăng nhập",
    "Đăng xuất",
    "Quản lý tài khoản",
    "Phân quyền người dùng",
    "Quản lý dịch vụ",
    "Quản lý kho",
    "Xem danh sách đề xuất nhập hàng",
    "Phê duyệt/từ chối đề xuất nhập hàng từ AI",
    "Xem tổng số người dùng",
    "Xem tổng số ca hẹn và doanh thu",
    "Xem biểu đồ dự báo 6 tháng từ AI",
    "Báo cáo, thống kê tổng thể"
])

add_heading_2(doc, "3.4.2. Yêu cầu phi chức năng của hệ thống")
add_para(doc, "Bên cạnh các yêu cầu chức năng, hệ thống Quản lý Dịch vụ Thú cưng cần đáp ứng một số yêu cầu phi chức năng nhằm bảo đảm bảo mật, tính nhất quán, hiệu năng, khả năng mở rộng và thuận tiện trong bảo trì:")

add_heading_3(doc, "Hiệu năng")
add_bullet(doc, "Hệ thống cần phản hồi nhanh đối với các thao tác phổ biến như đăng nhập, xem danh sách thú cưng, tra cứu bảng giá dịch vụ và kiểm tra khung giờ rảnh.")
add_bullet(doc, "API thông thường hướng đến thời gian phản hồi dưới 500 ms trong điều kiện kiểm thử xác định.")
add_bullet(doc, "Mô hình AI được tải sẵn vào bộ nhớ và tái sử dụng, không thực hiện huấn luyện lại trong mỗi request.")

add_heading_3(doc, "Bảo mật và phân quyền")
add_bullet(doc, "Mật khẩu người dùng phải được băm bằng Bcrypt trước khi lưu trữ vào cơ sở dữ liệu.")
add_bullet(doc, "Hệ thống sử dụng JWT để xác thực các request cần bảo vệ.")
add_bullet(doc, "Người dùng chỉ được thực hiện các chức năng phù hợp với vai trò Customer, Care Staff, Warehouse Staff và Admin.")
add_bullet(doc, "Backend phải kiểm tra quyền truy cập và quyền sở hữu tài nguyên, đặc biệt đối với thú cưng và các ca hẹn của khách hàng.")
add_bullet(doc, "Nhân viên chỉ được thực hiện các chức năng chăm sóc và kho bãi trong phạm vi quyền được cấp.")
add_bullet(doc, "Dữ liệu đầu vào cần được kiểm tra và xác thực trước khi xử lý.")

add_heading_3(doc, "Khả năng sử dụng")
add_bullet(doc, "Giao diện cần trực quan, dễ sử dụng theo phong cách Glassmorphism và hỗ trợ người dùng nhanh chóng tìm kiếm dịch vụ, xem lịch và đặt lịch hẹn.")
add_bullet(doc, "Các chức năng cần được tổ chức rõ ràng theo từng vai trò người dùng với bảng màu nhận diện trực quan.")
add_bullet(doc, "Giao diện cần hỗ trợ tốt trên môi trường desktop, laptop và máy tính bảng tại quầy lễ tân.")

add_heading_3(doc, "Khả năng mở rộng và bảo trì")
add_bullet(doc, "Hệ thống cần được tổ chức thành các module riêng biệt giữa Frontend, Backend, Database và AI Microservice để thuận tiện cho việc phát triển và bảo trì.")
add_bullet(doc, "Kiến trúc cần cho phép bổ sung các chức năng mở rộng như cổng thanh toán trực tuyến, gửi tin nhắn Zalo/SMS thông báo hoặc hỗ trợ chuỗi nhiều chi nhánh trong tương lai.")
add_bullet(doc, "Mô hình dữ liệu và API cần được thiết kế linh hoạt với Prisma ORM để có thể mở rộng hệ thống khi cần thiết.")

add_heading_3(doc, "Yêu cầu đối với AI/ML")
add_bullet(doc, "Mô hình Random Forest Regressor được cấu hình với 50 cây quyết định để tối ưu giữa độ chính xác dự đoán và thời gian phản hồi.")
add_bullet(doc, "Feature dùng cho huấn luyện và dự đoán (năm, tháng, nhiệt độ, lượng mưa, hệ số mùa vụ) phải được xây dựng nhất quán, hạn chế rò rỉ dữ liệu.")
add_bullet(doc, "Có công thức tính toán tồn kho an toàn (SS) và điểm đặt hàng lại (ROP) làm cơ sở đối chiếu (baseline) với đề xuất của mô hình.")

add_heading_3(doc, "Tính nhất quán và ổn định")
add_bullet(doc, "Hệ thống không được tạo hai ca hẹn trùng lặp trên cùng một khung giờ làm việc của nhân viên.")
add_bullet(doc, "Quy trình duyệt nhập kho và cập nhật số lượng tồn kho phải được xử lý bảo đảm tính toàn vẹn dữ liệu.")
add_bullet(doc, "Giá dịch vụ và giá sản phẩm tại thời điểm phát sinh giao dịch phải được lưu chính xác và không bị thay đổi khi bảng giá được cập nhật.")
add_bullet(doc, "Hệ thống cần xử lý lỗi bằng thông báo và mã trạng thái HTTP phù hợp.")
add_bullet(doc, "Không được xóa vật lý dữ liệu lịch hẹn và dữ liệu lịch sử kho nếu việc xóa làm mất thông tin phục vụ thống kê và truy vết.")

add_heading_1(doc, "3.5. Quy tắc nghiệp vụ của hệ thống")
add_bullet(doc, "Mỗi người dùng có một tài khoản riêng (định danh bằng email duy nhất) và được phân quyền theo vai trò Customer, Care Staff, Warehouse Staff hoặc Admin.", "BR01: ")
add_bullet(doc, "Chỉ người dùng đã đăng nhập mới có thể thực hiện các chức năng yêu cầu xác thực như đặt lịch hẹn, quản lý thú cưng, nhập xuất kho và phê duyệt đề xuất.", "BR02: ")
add_bullet(doc, "Mỗi hồ sơ thú cưng (Pet) thuộc về một khách hàng cụ thể; khách hàng chỉ được quản lý và đặt lịch cho thú cưng thuộc sở hữu của mình.", "BR03: ")
add_bullet(doc, "Một khung giờ rảnh (Slot) trong một ngày không được có hai ca hẹn bị trùng hoặc chồng lấn thời gian.", "BR04: ")
add_bullet(doc, "Khách hàng chỉ được đặt lịch trong các khung giờ còn trống và ca hẹn mới được tạo ở trạng thái chờ tiếp nhận (PENDING).", "BR05: ")
add_bullet(doc, "Khi ca hẹn bị hủy hợp lệ (chỉ được hủy khi ở trạng thái PENDING), khung giờ tương ứng được giải phóng và có thể được khách hàng khác đặt lại.", "BR06: ")
add_bullet(doc, "Nhân viên chăm sóc chỉ được chuyển ca hẹn sang trạng thái hoàn thành (COMPLETED) khi đã nhập đầy đủ nội dung tóm tắt chăm sóc (Care Summary).", "BR07: ")
add_bullet(doc, "Khi đơn hàng bán lẻ được xác nhận, hệ thống phải tự động trừ số lượng tồn kho thực tế và ghi nhận giao dịch xuất kho loại OUT.", "BR08: ")
add_bullet(doc, "Khi số lượng tồn kho thực tế nhỏ hơn hoặc bằng điểm đặt hàng lại (ROP) hoặc mức tồn tối thiểu, AI sẽ tự động lập đề xuất nhập hàng ở trạng thái bản nháp (DRAFT).", "BR09: ")
add_bullet(doc, "Chỉ Quản trị viên (Admin) mới có quyền phê duyệt đề xuất nhập hàng; khi được phê duyệt, hệ thống tự động sinh giao dịch nhập kho loại IN và cộng dồn số lượng tồn kho mới.", "BR10: ")
add_bullet(doc, "Giá tại thời điểm đặt dịch vụ hoặc mua hàng phải được lưu cố định để bảo đảm không thay đổi khi bảng giá niêm yết được cập nhật.", "BR11: ")
add_bullet(doc, "Không được xóa vật lý dữ liệu lịch hẹn, đơn hàng và lịch sử giao dịch kho để phục vụ công tác thống kê doanh thu và truy vết kiểm toán.", "BR12: ")
add_bullet(doc, "Các thao tác quan trọng cần lưu lại thời gian thực hiện (createdAt) và người thực hiện để phục vụ kiểm tra và quản lý khi cần thiết.", "BR13: ")

add_heading_1(doc, "3.6. Mô hình hóa yêu cầu")
add_heading_2(doc, "3.6.1. Sơ đồ Use Case tổng quát")
add_para(doc, "Dựa trên các yêu cầu chức năng và phân quyền hệ thống, sơ đồ Use Case tổng quát thể hiện toàn bộ mối quan hệ giữa 4 tác nhân chính và các ca sử dụng cốt lõi:")
add_bullet(doc, "Tương tác với các ca sử dụng Đăng ký, Đăng nhập, Đăng xuất, Quản lý thông tin cá nhân, Quản lý thú cưng, Quản lý lịch hẹn cá nhân và Tìm kiếm thông tin.", "• Tác nhân Khách hàng: ")
add_bullet(doc, "Tương tác với các ca sử dụng Đăng nhập, Đăng xuất, Quản lý lịch hẹn, Quản lý dịch vụ, Quản lý chương trình khuyến mãi, Quản lý hồ sơ thú cưng và Báo cáo, thống kê.", "• Tác nhân Nhân viên: ")
add_bullet(doc, "Tương tác với các ca sử dụng Đăng nhập, Đăng xuất, Quản lý kho (Nhập/Xuất/Tồn kho), Dự báo nhu cầu và Lập đề xuất nhập hàng.", "• Tác nhân Quản lý kho: ")
add_bullet(doc, "Tương tác với các ca sử dụng Đăng nhập, Đăng xuất, Quản lý tài khoản, Phân quyền người dùng, Quản lý kho và Báo cáo, thống kê.", "• Tác nhân Quản trị viên (Admin): ")
add_bullet(doc, "Các ca sử dụng nghiệp vụ yêu cầu bắt buộc phải đăng nhập thành công trước khi thực hiện.", "• Quan hệ <<Include>>: ")
add_bullet(doc, "Ca sử dụng Đăng xuất mở rộng từ ca sử dụng Đăng nhập khi người dùng muốn kết thúc phiên làm việc.", "• Quan hệ <<Extend>>: ")

output_path = r"d:\Khoaluantotnghiep\PetCareManagement\CHUONG_3_PHAN_TICH_YEU_CAU.docx"
doc.save(output_path)
print(f"Successfully generated Chapter 3 Word doc: {output_path}")
