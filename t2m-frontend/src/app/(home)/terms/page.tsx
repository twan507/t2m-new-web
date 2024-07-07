import React from 'react'
import { Row, Col, Card } from 'antd'

const TermsAndConditions = () => (
    <Row
        justify="center"
        align="top"
        style={{
            backgroundColor: 'black',
            margin: 0,
            padding: 0
        }}
    >
        <Col
            xs={22} sm={20} md={16} lg={12} xl={10}
            style={{
                maxWidth: '100%', // Ensures the Col does not exceed the width of its content
            }}
        >
            <Card
                style={{
                    backgroundColor: '#191919',
                    color: '#dfdfdf',
                    borderRadius: '10px',
                    border: 'none',
                    marginTop: '30px',
                    marginBottom: '30px'
                }}
                bodyStyle={{
                    padding: '20px',
                }}
            >
                <h1 style={{ textAlign: 'center', fontFamily: 'Helvetica Neue, sans-serif', marginBottom: '0px' }}>
                    ĐIỀU KHOẢN SỬ DỤNG
                </h1>
                <h2 style={{ textAlign: 'center', fontFamily: 'Helvetica Neue, sans-serif', marginTop: '0px' }}>
                    (Terms and Conditions)
                </h2>
                <h3 style={{ textAlign: 'left', fontFamily: 'Helvetica Neue, sans-serif', marginTop: '0px', fontSize: '18px' }}>
                    Giải thích thuật ngữ
                </h3>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Khách hàng là những cá nhân, tổ chức, hoặc bất kỳ ai truy cập và sử dụng trang web <a href="/">www.t2m.vn</a> dưới mọi hình thức.
                </p>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Website là trang web <a href="/">www.t2m.vn</a>, bao gồm cả các trang liên kết đối với các sản phẩm và dịch vụ của T2M Invest.
                </p>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Cộng đồng hội viên là một nhóm những khách hàng đã và đang sử dụng dịch vụ của T2M Invest, cùng nhau trao đổi và chia sẻ về các phương pháp cũng như kinh nghiệm đầu tư theo quy định cộng đồng của T2M Invest.
                </p>
                <h3 style={{ textAlign: 'left', fontFamily: 'Helvetica Neue, sans-serif', marginTop: '0px', fontSize: '18px' }}>
                    Quy định sử dụng Website
                </h3>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Tất cả các thông tin, sản phẩm, dịch vụ trên Website bao gồm nhưng không giới hạn mọi hình thức thiết kế, nội dung, âm thanh và hình ảnh đều thuộc quyền sở hữu của T2M Invest, trừ trường hợp do chính T2M Invest công bố khác đi, và được bảo vệ bởi luật bản quyền Việt Nam.
                </p>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    T2M Invest nghiêm cấm mọi hình thức sử dụng không được phép đối với Website, bao gồm việc lạm dụng, ăn cắp bản quyền, sử dụng sai ý nghĩa của bất cứ sản phẩm nào đưa trên Website và các quy định về tính bảo mật mà không có sự đồng ý bằng văn bản của T2M Invest.
                </p>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Khách hàng khi mua các gói sản phẩm tại T2M Invest được đảm bảo các quyền lợi sử dụng tuy theo chính sách bán hàng từng thời kỳ. Các thanh toán liên quan tới việc mua các gói sản phẩm sẽ không thể hoàn lại.
                </p>
                <h3 style={{ textAlign: 'left', fontFamily: 'Helvetica Neue, sans-serif', marginTop: '0px', fontSize: '18px' }}>
                    Quy định khi tham gia cộng đồng hội viên
                </h3>
                <h4 style={{ textAlign: 'left', fontFamily: 'Helvetica Neue, sans-serif', marginTop: '0px', fontSize: '17px', margin: '0px' }}>
                    Nguyên tắc chia sẻ thông tin
                </h4>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Khuyến khích chia sẻ các nội dung được trích dẫn từ các nguồn thông tin chính thống, tránh đăng tải thông tin sai sự thật hoặc chưa được kiểm chứng nhằm phục vụ các mục đích quảng bá hoặc làm giá cổ phiếu.
                </p>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Khách hàng tham gia cộng đồng cần sử dụng ngôn từ lịch sự, tuân thủ chuẩn mực văn hóa và đạo đức.
                </p>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Việc giới thiệu, rao mua, rao bán chứng khoán, bất động sản, hoặc các sản phẩm dịch vụ khác phải được sự đồng ý của đội ngũ Quản trị (Admin).
                </p>
                <h4 style={{ textAlign: 'left', fontFamily: 'Helvetica Neue, sans-serif', marginTop: '0px', fontSize: '17px', margin: '0px' }}>
                    Các hành vi bị cấm
                </h4>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Tuyên truyền chống lại Nhà nước Cộng hòa xã hội chủ nghĩa Việt Nam, gây phương hại đến an ninh quốc gia, trật tự an toàn xã hội, phá hoại khối đại đoàn kết dân tộc, tuyên truyền chiến tranh, khủng bố, gây hận thù, mâu thuẫn giữa các dân tộc, sắc tộc, tôn giáo.
                </p>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Tuyên truyền, kích động bạo lực, dâm ô, đồi trụy, tội ác, tệ nạn xã hội, mê tín dị đoan, phá hoại thuần phong, mỹ tục của dân tộc.
                </p>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Tiết lộ bí mật nhà nước, bí mật quân sự, an ninh, kinh tế, đối ngoại và những bí mật khác do pháp luật quy định.
                </p>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Đưa thông tin xuyên tạc, vu khống, xúc phạm uy tín của tổ chức, danh dự và nhân phẩm của cá nhân.
                </p>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Quảng cáo, tuyên truyền, mua bán hàng hóa, dịch vụ bị cấm, truyền bá tác phẩm báo chí, văn học, nghệ thuật, xuất bản phẩm bị cấm.
                </p>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Giả mạo tổ chức, cá nhân và phát tán thông tin giả mạo, thông tin sai sự thật xâm hại đến quyền và lợi ích hợp pháp của tổ chức, cá nhân.
                </p>
                <h4 style={{ textAlign: 'left', fontFamily: 'Helvetica Neue, sans-serif', marginTop: '0px', fontSize: '17px', margin: '0px' }}>
                    Cơ chế xử lý vi phạm
                </h4>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Đội ngũ quản trị (Admin) có toàn quyền trong việc xác định và xử lý bài/thành viên vi phạm quy định. Tuỳ mức độ nặng nhẹ sẽ bị nhắc nhở, cảnh báo, áp dụng các biện pháp xử lý bài viết, khóa tài khoản hoặc xoá khỏi cộng đồng tạm thời hoặc vĩnh viễn.
                </p>
                <h3 style={{ textAlign: 'left', fontFamily: 'Helvetica Neue, sans-serif', marginTop: '0px', fontSize: '18px' }}>
                    Miễn trừ trách nhiệm
                </h3>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Các thông tin trên Website được cung cấp với mức độ tin cậy cao nhất nhưng chỉ dành cho mục đích tham khảo thông tin. T2M Invest không chịu trách nhiệm đảm bảo cho sự hoàn thiện, tính cập nhật hoặc tính chính xác hoặc độ sẵn sàng liên tục của thông tin cũng như các thiệt hại, mất mát do việc sử dụng Website gây ra.
                </p>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Khách hàng cần nhận thức rõ ràng rằng đầu tư chứng khoán đi kèm với rủi ro và có thể dẫn đến mất mát vốn đầu tư. T2M Invest không chịu trách nhiệm cho những mất mát có thể xảy ra từ các quyết định đầu tư của khách hàng.
                </p>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Các sản phẩm phân tích từ T2M Invest không nên được hiểu là khuyến nghị đầu tư cụ thể nào. Khách hàng nên tìm kiếm sự tư vấn từ các chuyên gia tài chính độc lập trước khi thực hiện bất kỳ quyết định đầu tư nào.
                </p>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Website này chỉ phục vụ mục đích cung cấp thông tin, không liên quan đến các mục tiêu đầu tư cá nhân, khuyến nghị đầu tư, không nhằm mục đích định hướng hay khuyến nghị bất cứ quyết định đầu tư nào của khách hàng.
                </p>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    T2M Invest không chịu trách nhiệm đối với những thay đổi không lường trước được trong điều kiện thị trường, chính trị, kinh tế hoặc các yếu tố khác có thể ảnh hưởng việc sử dụng hiệu quả của những thông được cung cấp trên Website.
                </p>
                <h3 style={{ textAlign: 'left', fontFamily: 'Helvetica Neue, sans-serif', marginTop: '0px', fontSize: '18px' }}>
                    Xử lý khiếu nại
                </h3>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Mọi thắc mắc và khiếu nại của người sử dụng dịch vụ được tiếp nhận qua hòm thư điện tử <a href="mailto:mail.t2minvest@gmail.com">mail.t2minvest@gmail.com</a>.
                </p>
                <p style={{ textAlign: 'justify', fontSize: '16px', fontFamily: 'Helvetica Neue, sans-serif' }}>
                    Trong trường hợp nằm ngoài khả năng và thẩm quyền của chúng tôi, Ban quản trị sẽ yêu cầu thành viên đưa vụ việc ra cơ quan nhà nước có thẩm quyền giải quyết theo quy định của pháp luật.
                </p>

            </Card>
        </Col>
    </Row>
)

export default TermsAndConditions
