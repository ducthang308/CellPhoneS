import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { userService } from "../../services/UserService";
import type { LoginResponse } from "../../services/Interface";
import styles from "./account_detail.module.css";

const AccountDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const account = location.state as LoginResponse | null;
  if (!account) {
    navigate("/admin/manage_account");
    return null;
  }

  /* ===== INFO ===== */
  const [fullName, setFullName] = useState(account.fullName);
  const [email, setEmail] = useState(account.email);
  const [address, setAddress] = useState(account.address);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  /* ===== PASSWORD (OPTIONAL) ===== */
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveAll = async () => {
    try {
      /* 1️⃣ UPDATE INFO */
      await userService.updateUser(
        account.userId,
        { fullName, email, address },
        avatarFile
      );

      /* 2️⃣ CHANGE PASSWORD (IF USER ENTERED) */
      if (oldPassword || newPassword || confirmPassword) {
        if (!oldPassword || !newPassword || !confirmPassword) {
          alert("Vui lòng nhập đầy đủ thông tin đổi mật khẩu");
          return;
        }

        if (newPassword.length < 6) {
          alert("Mật khẩu mới phải tối thiểu 6 ký tự");
          return;
        }

        if (newPassword !== confirmPassword) {
          alert("Xác nhận mật khẩu không khớp");
          return;
        }

        await userService.changePassword(account.userId, {
          oldPassword,
          newPassword
        });
      }

      alert("Cập nhật tài khoản thành công");
      navigate("/admin/manage_account");
    } catch (e) {
      console.error(e);
      alert("Cập nhật thất bại");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Chi tiết tài khoản</h1>

      {/* ===== INFO ===== */}
      <label>Họ tên</label>
      <input value={fullName} onChange={e => setFullName(e.target.value)} />

      <label>Email</label>
      <input value={email} onChange={e => setEmail(e.target.value)} />

      <label>Địa chỉ</label>
      <input value={address} onChange={e => setAddress(e.target.value)} />

      <label>Avatar</label>
      <input
        type="file"
        accept="image/*"
        onChange={e => setAvatarFile(e.target.files?.[0] || null)}
      />

      <hr className={styles.divider} />

      <hr className={styles.divider} />

      <div className={styles.passwordSection}>
        <div className={styles.passwordTitle}>
          Đổi mật khẩu (không bắt buộc)
        </div>

        <p className={styles.passwordHint}>
          Chỉ nhập nếu bạn thực sự muốn đổi mật khẩu.
        </p>

        <label>Mật khẩu hiện tại</label>
        <input
          type="password"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          placeholder="••••••••"
        />

        <label>Mật khẩu mới</label>
        <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />

        <label>Xác nhận mật khẩu mới</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
      </div>

      <div className={styles.actions}>
        <button onClick={handleSaveAll}>Lưu</button>
        <button onClick={() => navigate(-1)}>Huỷ</button>
      </div>
    </div>
  );
};

export default AccountDetail;
