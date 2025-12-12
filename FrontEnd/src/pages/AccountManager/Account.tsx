import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Account.css';

interface User {
  userId: number;
  sdt: string;
  FullName: string;
  Email: string;
  Address: string;
  RoLeId: number;
  GoogleId?: string | null;
}

const mockUser: User = {
  userId: 1,
  sdt: "0325043591",
  FullName: "Huy Tún",
  Email: "leta1101109@gmail.com",
  Address: "123 Đường Láng, Đống Đa, Hà Nội",
  RoLeId: 1,
  GoogleId: null,
};

const AccountPage: React.FC = () => {
  const { user, loading } = useAuth(); // ← LẤY USER TỪ CONTEXT
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.sdt || '');
      setEmail(user.email || 'Chưa cập nhật');
      setAddress(user.address || '');
    }
  }, [user]);

  const handleSave = async () => {
    // Gọi API cập nhật ở đây (sẽ làm sau)
    console.log('Đang lưu:', { fullName, phone, email, address });
    setIsEditing(false);
  };

  // Nếu đang load hoặc chưa đăng nhập
  if (loading || !user) {
    return (
      <div className="account-container">
        <div className="loading">Đang tải thông tin tài khoản...</div>
      </div>
    );
  }

  return (
    <div className="account-container">
      <div className="account-wrapper">
        {/* Main content */}
        <main className="account-main">
          <h2 className="page-title">Thông tin tài khoản</h2>

          <div className="info-card">
            <div className="card-header">
              <h3>Thông tin cá nhân</h3>
              {!isEditing ? (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  Chỉnh sửa
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                    Hủy
                  </button>
                  <button className="save-btn" onClick={handleSave}>
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </div>

            <div className="info-grid">
              <div className="info-item">
                <label>Họ và tên</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                ) : (
                  <p>{fullName || 'Chưa cập nhật'}</p>
                )}
              </div>

              <div className="info-item">
                <label>Số điện thoại</label>
                <p className="readonly-text">{phone}</p> {/* Không cho sửa số điện thoại */}
              </div>

              <div className="info-item">
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                ) : (
                  <p>{email}</p>
                )}
              </div>

              <div className="info-item full-width">
                <label>Địa chỉ</label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nhập địa chỉ chi tiết..."
                  />
                ) : (
                  <p>{address || 'Chưa cập nhật địa chỉ'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="info-card">
            <div className="card-header">
              <h3>Thông tin đăng nhập</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Phương thức đăng nhập</label>
                <p>Email & Mật khẩu</p>
              </div>
              <div className="info-item">
                <label>Vai trò</label>
                <p>{user.role === 1 ? 'Quản trị viên' : 'Khách hàng'}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountPage;