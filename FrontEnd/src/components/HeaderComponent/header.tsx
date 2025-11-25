    import React from 'react'
    import Logo from "../../assets/img/logo.png"

    import "./header.css"
    import { Tabs } from 'antd';
    import type { TabsProps } from 'antd';
    import { useNavigate } from 'react-router-dom';
    
    const header = () => {
        const navigative = useNavigate();
        const handleTabChange = (key: string) => {
            switch (key) {
            case "1":
                navigative("/Phone");
                break;
            case "2":
                navigative("/Laptop");
                break;
            case "3":
                navigative("/products/ipad");
                break;
            case "4":
                navigative("/products/accessory");
                break;
            case "5":
                navigative("/about");
                break;
            case "6":
                navigative("/pricing");
                break;
            default:
                navigative("/");
            }
    };

const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Điện thoại',    
    },
    {
        key: '2',
        label: 'Laptop',
    },
    {
        key: '3',
        label: 'Ipad',
    },
    {
        key: '4',
        label: 'Phụ kiện',
    },
    {
        key: '5',
        label: 'Blog về chúng tôi',
    },
    {
        key: '6',
        label: 'Bảng giá dịch vụ',
    },
];
 
    return (
        <div className="header">
            <div className="navbar-top">
                <div className="top-left">
                    <div className="logo" onClick={() => navigative('/')}>
                        <a className="logo-link" href='#'>
                            <img
                                className="logo-link-img"
                                src={Logo}
                                alt="Logo"
                                style={{ cursor: 'pointer' }}
                            />
                        </a>
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

                <div className="top-right">
                    <ul className="list-user-actions">
                        <li className="list-user-item" onClick={() => navigative('/account')}>
                            <i className="fa-solid fa-heart"></i>
                            <p className="list-user-item-text">Tài khoản</p>
                        </li>
                        <li className="list-user-item" onClick={() => navigative('/wish')} >
                            <i className="fa-solid fa-user-plus"></i>
                            <p className="list-user-item-text">Sản phẩm yêu thích</p>
                        </li>      
                        <li className="list-user-item" onClick={() => navigative('/AddListing')} style={{ cursor: 'pointer' }}>
                            <i className="fa-solid fa-right-to-bracket"></i>
                            <p className="list-user-item-text">Đăng tin</p>
                        </li>
                        <li className="list-user-item list-user-item-button" onClick={() => navigative('/login')} style={{ cursor: 'pointer' }}>
                            <i className="fa-solid fa-pen-to-square"></i>
                            <p className="list-user-item-text">Đăng nhập</p>
                        </li>    
                    </ul>
                </div>
            </div>

            <div className="navbar-bot">
                {/* <ul className="list-category">
                    <li className="list-category-item">
                        <a href="" className="link-category">Phòng trọ</a>
                    </li>
                    <li className="list-category-item">
                        <a href="" className="link-category">Căn hộ cao cấp</a>
                    </li>
                    <li className="list-category-item">
                        <a href="" className="link-category">Căn hộ chung cư</a>
                    </li>
                    <li className="list-category-item">
                        <a href="" className="link-category">Nhà nguyên căn</a>
                    </li>
                    <li className="list-category-item">
                        <a href="" className="link-category">Căn hộ ở ghép</a>
                    </li>
                    <li className="list-category-item">
                        <a href="" className="link-category">Căn hộ mini</a>
                    </li>
                    <li className="list-category-item">
                        <a href="" className="link-category">Mặt bằng cho thuê</a>
                    </li>
                    <li className="list-category-item">
                        <a href="" className="link-category">Blog về chúng tôi</a>
                    </li>
                    <li className="list-category-item">
                        <a href="" className="link-category">Bảng giá dịch vụ</a>
                    </li>
                </ul> */}

                {/* <Tabs className='list-category' defaultActiveKey="1" items={items} /> */}

                
                <div className="navbar-bot">
                    <Tabs
                    className="list-category"
                    defaultActiveKey="1"
                    items={items}
                    onChange={handleTabChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default header   