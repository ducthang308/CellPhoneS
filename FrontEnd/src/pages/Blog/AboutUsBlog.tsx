import React from "react";
import "./AboutUsBlog.css";

export default function AboutUsPanels() {
    return (
        <main className="about-page">
            {/* ===== HERO PANEL ===== */}
            <section className="about-hero">
                <div className="about-container">
                    <h1 className="about-hero__title">
                        Về chúng tôi
                    </h1>
                    <p className="about-hero__subtitle">
                        Chúng tôi xây dựng nền tảng quản lý bán hàng & kho vận hiện đại,
                        tập trung vào hiệu năng, trải nghiệm người dùng và khả năng mở rộng dài hạn.
                    </p>
                </div>
            </section>

            {/* ===== MISSION PANEL ===== */}
            <section className="about-panel">
                <div className="about-container grid-2">
                    <div>
                        <h2>Sứ mệnh</h2>
                        <p>
                            Sứ mệnh của chúng tôi là đơn giản hóa các hệ thống phức tạp.
                            Từ quản lý sản phẩm, tồn kho, đơn hàng cho đến đánh giá và chăm sóc khách hàng –
                            mọi thứ phải rõ ràng, nhất quán và dễ vận hành.
                        </p>
                        <p>
                            Chúng tôi tin rằng một hệ thống tốt không chỉ chạy được,
                            mà còn phải <strong>dễ hiểu – dễ mở rộng – khó lỗi</strong>.
                        </p>
                    </div>

                    <div className="about-card">
                        <h3>Triết lý phát triển</h3>
                        <ul>
                            <li>Ưu tiên trải nghiệm người dùng cuối</li>
                            <li>Kiến trúc rõ ràng, dễ bảo trì</li>
                            <li>Không đánh đổi bảo mật lấy sự tiện lợi</li>
                            <li>Luôn sẵn sàng mở rộng trong tương lai</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ===== WHAT WE BUILD PANEL ===== */}
            <section className="about-panel alt">
                <div className="about-container">
                    <h2 className="center">Chúng tôi đang xây dựng gì?</h2>

                    <div className="feature-grid">
                        <div className="feature-card">
                            <h3>Quản lý sản phẩm</h3>
                            <p>
                                CRUD sản phẩm, hình ảnh, thông số kỹ thuật,
                                phân loại rõ ràng, tối ưu cho SEO và hiệu năng tải.
                            </p>
                        </div>

                        <div className="feature-card">
                            <h3>Kho & tồn</h3>
                            <p>
                                Theo dõi tồn kho theo lô, hạn sử dụng,
                                nhập – xuất – thống kê chính xác theo thời gian thực.
                            </p>
                        </div>

                        <div className="feature-card">
                            <h3>Đơn hàng & thanh toán</h3>
                            <p>
                                Quản lý vòng đời đơn hàng,
                                tích hợp nhiều phương thức thanh toán,
                                đảm bảo dữ liệu minh bạch và an toàn.
                            </p>
                        </div>

                        <div className="feature-card">
                            <h3>Đánh giá & trải nghiệm</h3>
                            <p>
                                Hệ thống review có kiểm soát,
                                gắn với đơn hàng thật,
                                giúp tăng độ tin cậy và chất lượng nội dung.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== WHY US PANEL ===== */}
            <section className="about-panel">
                <div className="about-container grid-2">
                    <div className="about-highlight">
                        <h2>Vì sao chọn chúng tôi?</h2>
                        <p>
                            Chúng tôi không chạy theo số lượng tính năng.
                            Thứ chúng tôi theo đuổi là <strong>chất lượng hệ thống</strong>
                            và khả năng vận hành ổn định trong môi trường thực tế.
                        </p>
                    </div>

                    <div className="about-card">
                        <ul className="check-list">
                            <li>Thiết kế hiện đại, nhất quán UI/UX</li>
                            <li>Chuẩn SEO, chuẩn cấu trúc dữ liệu</li>
                            <li>Bảo mật và phân quyền rõ ràng</li>
                            <li>Dễ tích hợp, dễ mở rộng</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ===== TEAM PANEL (FOOTER) ===== */}
            <section className="about-team">
                <div className="about-container">
                    <h2 className="center">Thành viên</h2>

                    <div className="team-names">
                        <span>Tán Quang Huy</span>
                        <span>Nguyễn Đức Thắng</span>
                        <span>Nguyễn Văn Thắng</span>
                        <span>Hoàng Đình Lâm Hải</span>
                    </div>
                </div>
            </section>
        </main>
    );
}
