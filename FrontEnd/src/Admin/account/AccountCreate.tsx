import React, { useEffect, useState } from "react";
import styles from "./account_create.module.css";
import { register } from "../../services/UserService";
import { useNavigate } from "react-router-dom";

type RegisterFormProps = {
  onSuccess?: (sdt: string) => void;
};

type RegisterFormData = {
  sdt: string;
  hoVaTen: string;
  email: string;
  diaChi: string;
  matKhau: string;
  reMatKhau: string; // FE only
  role: string;
};

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    sdt: "",
    hoVaTen: "",
    email: "",
    diaChi: "",
    matKhau: "",
    reMatKhau: "",
    role: "1",
  });

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  /* ===== CHẶN AUTOFILL KHI MOUNT ===== */
  useEffect(() => {
    setFormData({
      sdt: "",
      hoVaTen: "",
      email: "",
      diaChi: "",
      matKhau: "",
      reMatKhau: "",
      role: "1",
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isMismatch =
    formData.reMatKhau.length > 0 &&
    formData.matKhau !== formData.reMatKhau;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.matKhau.length < 6) {
      alert("Mật khẩu phải tối thiểu 6 ký tự");
      return;
    }

    if (isMismatch) {
      alert("Mật khẩu nhập lại không khớp");
      return;
    }

    try {
      const { reMatKhau, ...payload } = formData;
      await register(payload as any);

      alert("Tạo tài khoản thành công");
       navigate(-1);
      onSuccess?.(formData.sdt);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Tạo tài khoản thất bại");
    }
  };

  return (
    <div className={styles["account-create-container"]}>
      <h2 className={styles.title}>Tạo tài khoản</h2>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <input
          name="sdt"
          placeholder="Số điện thoại"
          value={formData.sdt}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />

        <input
          name="hoVaTen"
          placeholder="Họ và tên"
          value={formData.hoVaTen}
          onChange={handleChange}
          autoComplete="off"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="off"
          required
        />

        <input
          name="diaChi"
          placeholder="Địa chỉ"
          value={formData.diaChi}
          onChange={handleChange}
          autoComplete="off"
          required
        />

        {/* ===== PASSWORD ===== */}
        <div className={styles.passwordBlock}>
          <div className={styles.passwordField}>
            <input
              name="matKhau"
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              value={formData.matKhau}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => setShowPassword(v => !v)}
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>

          <div className={styles.passwordField}>
            <input
              name="reMatKhau"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              value={formData.reMatKhau}
              onChange={handleChange}
              autoComplete="new-password"
              className={isMismatch ? styles.inputError : ""}
              required
            />
          </div>

          {isMismatch && (
            <p className={styles.errorText}>
              Mật khẩu nhập lại không khớp
            </p>
          )}
        </div>

        <input
          type="text"
          value="Người dùng"
          disabled
          className="readonly-input"
        />

        <button
          type="submit"
          className={styles["submit-btn"]}
          disabled={isMismatch}
        >
          Tạo tài khoản
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
