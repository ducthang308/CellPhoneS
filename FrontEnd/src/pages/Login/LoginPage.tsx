import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LoginPage.css";
import Register from "../Register/Register";
import { login } from "../../services/UserService";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../../services/UserService";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState<"login" | "register">("login");
    const [loading, setLoading] = useState(false);


    const { setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        try {
            const data = await login(email, password);

            if (!data?.token) {
                throw new Error("Token không hợp lệ");
            }

            localStorage.setItem("accessToken", data.token);
            localStorage.setItem("cartId", data.cartId.toString());
            localStorage.setItem("role", data.role.toString());

            const { token, ...userInfo } = data;
            localStorage.setItem("user", JSON.stringify(userInfo));
            setUser(userInfo);

            const redirectTo =
                location.state?.redirectTo ||
                (data.role === 2 ? "/Admin/category" : "/");

            navigate(redirectTo, { replace: true });

        } catch (err: any) {
            console.error("Lỗi đăng nhập:", err);
            alert(err.message || "Đăng nhập thất bại");
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSuccess = (registeredEmail: string) => {
        setActiveTab("login");
        setEmail(registeredEmail);
        setPassword("");
    };

    const handleGoogleLogin = async (credential: string) => {
        if (loading) return;

        try {
            setLoading(true);

            const data = await loginWithGoogle(credential);

            localStorage.setItem("accessToken", data.token);
            localStorage.setItem("cartId", data.cartId.toString());
            localStorage.setItem("role", data.role.toString());

            const { token, ...userInfo } = data;
            localStorage.setItem("user", JSON.stringify(userInfo));
            setUser(userInfo);

            const redirectTo =
                location.state?.redirectTo ||
                (data.role === 2 ? "/Admin/category" : "/");

            navigate(redirectTo, { replace: true });

        } catch (err) {
            console.error("Google login failed", err);
            alert("Đăng nhập Google thất bại");
        } finally {
            setLoading(false);
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
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            placeholder="Nhập Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? (
                                <span className="btn-loading">
                                    <span className="spinner-sm"></span>
                                    Đang đăng nhập...
                                </span>
                            ) : (
                                "Đăng nhập"
                            )}
                        </button>

                        {/* ===== GOOGLE LOGIN ===== */}
                        <div style={{ marginTop: 16, textAlign: "center" }}>
                            <GoogleLogin
                                onSuccess={(res) => {
                                    if (res.credential) {
                                        handleGoogleLogin(res.credential);
                                    }
                                }}
                                onError={() => {
                                    alert("Google Login failed");
                                }}
                            />
                        </div>
                    </form>
                ) : (
                    <Register onSuccess={handleRegisterSuccess} />
                )}
            </div>
            {loading && (
                <div className="login-loading-overlay">
                    <div className="login-loading-box">
                        <div className="spinner"></div>
                        <p>Đang xác thực, vui lòng chờ...</p>
                    </div>
                </div>
            )}

        </div>
    );
};


export default LoginPage;
