import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LoginPage.css";
import Register from "../Register/Register";
import { login } from "../../services/UserService";

const LoginPage = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState<"login" | "register">("login");

    const navigate = useNavigate();
    const location = useLocation();

    // 👉 lấy redirectTo nếu có
    const redirectTo = location.state?.redirectTo || "/";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await login(phone, password);

            if (data?.token) {
                // 🔥 đồng bộ key
                localStorage.setItem("accessToken", data.token);
                localStorage.setItem("userId", data.id.toString());
                localStorage.setItem("phone", data.phone_number);

                navigate(redirectTo, { replace: true });
            }
        } catch (err: any) {
            console.error("Lỗi đăng nhập:", err);
            alert(err.message || "Đăng nhập thất bại");
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-form">
                <div className="login-tabs">
                    <span
                        className={activeTab === "login" ? "active-tab" : "inactive-tab"}
                        onClick={() => setActiveTab("login")}
                    >
                        Đăng nhập
                    </span>
                    <span
                        className={activeTab === "register" ? "active-tab" : "inactive-tab"}
                        onClick={() => setActiveTab("register")}
                    >
                        Đăng ký tài khoản
                    </span>
                </div>

                {activeTab === "login" ? (
                    <>
                        <form onSubmit={handleLogin}>
                            <input
                                type="text"
                                placeholder="Số điện thoại"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="submit" className="login-btn">
                                Đăng nhập
                            </button>
                        </form>
                    </>
                ) : (
                    <Register />
                )}
            </div>
        </div>
    );
};

export default LoginPage;
