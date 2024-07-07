import React from 'react';
import './footer.css';

const FooterComponent = () => {
    return (
        <footer className="footer">
            <div className="footer-inner">

                <div className="footer-section-left">
                    <a target="_blank" href="index.html">
                        <img src="photo/slogo.png" alt="T2M Logo" className="footer-logo" />
                    </a>
                    <div className="footer-links">

                    </div>
                </div>

                <div className="footer-section-right" id="fs1">
                    <p className="footer-title">Sản phẩm</p>
                    <ul>
                        <li><a target="_blank" href="https://zalo.me/g/fggvuq311">Dòng tiền thị trường</a></li>
                        <li><a target="_blank" href="https://zalo.me/g/fggvuq311">Bộ lọc chuyên sâu</a></li>
                        <li><a target="_blank" href="https://zalo.me/g/fggvuq311">Danh mục đầu tư T2M</a></li>
                    </ul>
                </div>

                <div className="footer-section-right" id="fs2">
                    <p className="footer-title">T2M Learning</p>
                    <ul>
                        <li><a target="_blank" href="https://zalo.me/g/fggvuq311">Hướng dẫn sử dụng</a></li>
                        <li><a target="_blank" href="https://zalo.me/g/fggvuq311">Phân tích dòng tiền</a></li>
                        <li><a target="_blank" href="https://zalo.me/g/fggvuq311">Phân tích kĩ thuật</a></li>
                    </ul>
                </div>

                <div className="footer-section-right" id="fs3">
                    <p className="footer-title">Tham gia cùng T2M Invest</p>
                    <div className="social-qr">
                        <div>
                            <a target="_blank" href="https://www.facebook.com/t2m.invest"><img src="photo/fb_qr.png" alt="T2M Logo" /></a>
                            <a target="_blank" className="qr-description" id="qr_1" href="https://www.facebook.com/t2m.invest">Facebook</a>
                            <br />
                            <a target="_blank" className="qr-description" id="qr_2" href="https://www.facebook.com/t2m.invest">Fanpage T2M Invest</a>
                        </div>
                        <div>
                            <a target="_blank" href="https://t.me/+U3k02NxS8ygwMGE1"><img src="photo/tele_qr.png" alt="T2M Logo" /></a>
                            <a target="_blank" className="qr-description" id="qr_3" href="https://www.facebook.com/t2m.invest">Telegram</a>
                            <br />
                            <a target="_blank" className="qr-description" id="qr_4" href="https://www.facebook.com/t2m.invest">Hội viên T2M Invest</a>
                        </div>
                        <div>
                            <a target="_blank" href="https://zalo.me/g/fggvuq311"><img src="photo/zalo_qr.png" alt="T2M Logo" /></a>
                            <a target="_blank" className="qr-description" id="qr_5" href="https://zalo.me/g/fggvuq311">Zalo</a>
                            <br />
                            <a target="_blank" className="qr-description" id="qr_6" href="https://zalo.me/g/fggvuq311">(+84) 368 075 410</a>
                        </div>
                    </div>

                </div>

            </div>
            <div className="footer-bottom">
                <p>© 2023 T2M Invest | <a target="_blank" href="/terms">Điều khoản sử dụng</a></p>
            </div>
        </footer>
    );
}

export default FooterComponent;
