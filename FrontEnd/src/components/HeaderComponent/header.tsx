import React, { useState } from 'react';
import Logo from "../../assets/img/logo.png";
import "./header.css";
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserCog, ShoppingCart, History, LogOut } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const routeToKey: Record<string, string> = {
    "/Phone": "1",
    "/Laptop": "2",
    "/products/ipad": "3",
    "/products/accessory": "4",
    "/about": "5",
    "/historyOrder": "6",
  };

  const activeKey = routeToKey[location.pathname] || "1";

  const handleTabChange = (key: string) => {
    const routes: Record<string, string> = {
      "1": "/Phone", "2": "/Laptop", "3": "/products/ipad",
      "4": "/products/accessory", "5": "/about", "6": "/historyOrder"
    };
    navigate(routes[key] || "/");
  };

  const items: TabsProps['items'] = [
    { key: '1', label: 'Điện thoại' },
    { key: '2', label: 'Laptop' },
    { key: '3', label: 'iPad' },
    { key: '4', label: 'Phụ kiện' },
    { key: '5', label: 'Blog về chúng tôi' },
    { key: '6', label: 'Lịch sử mua hàng' },
  ];

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <div className="header">
      <div className="navbar-top">
        <div className="top-left">
          <div className="logo" onClick={() => navigate('/')}>
            <img className="logo-link-img" src={Logo} alt="Logo" />
          </div>
          <div className="navbar-filter">
            <div className="search-wrapper">
              <i className="fa-solid fa-location-dot search-icon"></i>
              <input type="text" className="search-input" placeholder="Tìm kiếm sản phẩm" />
            </div>
            <div className="filter-wrapper">
              <i className="fa-solid fa-filter"></i>
              <span className="filter-text">Bộ lọc</span>
            </div>
          </div>
        </div>

        <div className="top-right-wrapper">
          <ul className="list-user-actions">
             <li className="list-user-item" onClick={() => navigate('/notification')}>
              <i className="fa-solid fa-bell"></i>
              <p className="list-user-item-text">Thông báo</p>
            </li>
            <li className="list-user-item" onClick={() => navigate('/cartShop')}>
              <i className="fa-solid fa-cart-shopping"></i>
              <p className="list-user-item-text">Giỏ hàng</p>
            </li>

            {user ? (
              <li className="list-user-item user-avatar-item">
                <div
                  className="user-avatar-trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="avatar-circle">
                    {user.sdt.slice(-3)}
                  </div>
                  <div className="user-info">
                    <p className="greeting">Xin chào</p>
                    <p className="phone">{user.sdt}</p>
                  </div>
                  <svg className={`arrow ${dropdownOpen ? 'rotated' : ''}`} viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </div>
              </li>
            ) : (
              <li className="list-user-item login-btn" onClick={() => navigate('/login')}>
                <i className="fa-solid fa-right-to-bracket"></i>
                <p className="list-user-item-text">Đăng nhập</p>
              </li>
            )}
          </ul>

          {user && dropdownOpen && (
            <>
              <div className="dropdown-overlay" onClick={() => setDropdownOpen(false)} />
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <p>Tài khoản của tôi</p>
                  <p className="phone-big">{user.sdt}</p>
                </div>
                <div className="dropdown-body">
                  <div className="dropdown-item" onClick={() => { navigate('/account'); setDropdownOpen(false); }}>
                    <UserCog size={20} />
                    <div>
                      <p className="title">Quản lý hồ sơ</p>
                      <p className="desc">Thông tin cá nhân, đổi mật khẩu</p>
                    </div>
                  </div>
                  <div className="dropdown-item" onClick={() => { navigate('/cartShop'); setDropdownOpen(false); }}>
                    <ShoppingCart size={20} />
                    <div>
                      <p className="title">Giỏ hàng & Thanh toán</p>
                    </div>
                  </div>
                  <div className="dropdown-item" onClick={() => { navigate('/historyOrder'); setDropdownOpen(false); }}>
                    <History size={20} />
                    <div>
                      <p className="title">Lịch sử mua hàng</p>
                    </div>
                  </div>
                  <hr />
                  <div className="dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Đăng xuất</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="navbar-bot">
        <Tabs className="list-category" activeKey={activeKey} items={items} onChange={handleTabChange} />
      </div>
    </div>
  );
};

export default Header;