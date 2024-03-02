import React, { useState } from "react";
import { FaReact } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { VscSearchFuzzy } from "react-icons/vsc";
import { Divider, Badge, Drawer, message, Avatar, Popover } from "antd";
import "./header.scss";
import { useDispatch, useSelector } from "react-redux";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { useNavigate } from "react-router";
import { MdMenu } from "react-icons/md";
import { callLogout } from '../../services/api';
import { doLoginAction, doLogoutAction } from '../../redux/account/accountSlice';
import { Link } from 'react-router-dom';


const Header = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);
  const accessToken = localStorage?.getItem('access_token');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const carts = useSelector(state => state.order.carts)

  const handleLogout = async() => {
    const res = await callLogout(accessToken);
    if(res && res.data) {
      dispatch(doLogoutAction());
      message.success('Đăng xuất thành công');
      navigate('/');
    }
  }

  let items = [
    {
      label: <label style={{cursor: "pointer"}}>Quản lí tài khoản</label>,
      key: "account",
    },
    {
      label: <label style={{cursor: "pointer"}} onClick={() => handleLogout()}>Đăng xuất</label>,
      key: "logout",
    }, 
  ];

  if(user?.role === "ADMIN") {
    items.unshift({
      label: <Link to="/admin">Trang quản trị</Link>,
      key : 'admin'
    })
  }
  

  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatars/${user?.avatar}`

  const contentPopover = () => {
    
    return (
      <div className='pop-cart-body'>
        <div className='pop-cart-content'>
          {carts.length > 0 && carts?.map((item) => {
            return ( 
              <>
                <div className='book'>
                  {/* {${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.detail?.thumbnail}} */}
                  <img src= {`${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.detail?.thumbnail}`} />
                  <div>{item?.detail?.mainText}</div>
                  <div>{`${item?.detail?.price} đ`}</div>
                </div>
              </>
            )
          })}
         
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="header-container">
        <header className="page-header">
          <div className="page-header__top">
            <div
              className="page-header__toggle"
              onClick={() => {
                setOpenDrawer(true);
              }}
            >
              <MdMenu />
            </div>
            <div className="page-header__logo">
              <span className="logo" onClick={() => navigate('/')}>
                <FaReact className="rotate icon-react" /> Chicken Dev
                <VscSearchFuzzy className="icon-search" />
              </span>
              <input
                className="input-search"
                type={"text"}
                placeholder="Bạn tìm gì hôm nay"
              />
            </div>
          </div>
          <nav className="page-header__bottom">
            <ul id="navigation" className="navigation">
              <li className="navigation__item">
                <Popover
                  className='popover-carts'
                  placement="topRight" 
                  rootClassName='popover-carts'
                  title={"Sản phẩm mới thêm"} 
                  content={contentPopover}
                  arrow={true}
                >
                    <Badge 
                      count={carts?.length ?? 0} 
                      size={"small"}
                      showZero
                      onClick={() => {isAuthenticated === true ? navigate('/order') : navigate('/login') } }
                    >
                      <FiShoppingCart className="icon-card" />
                    </Badge>
                </Popover>
              </li>
              <li className="navigation__item mobile">
                <Divider type="vertical" />
              </li>
              <li className="navigation__item mobile">
                {!isAuthenticated ? (
                  <span onClick={() => navigate("/login")}>Tài khoản</span>
                ) : (
                  <Dropdown menu={{ items }} trigger={["click"]}>
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        <Avatar src={urlAvatar}/>
                        {user?.fullName}
                        <DownOutlined />
                      </Space>
                    </a>
                  </Dropdown>
                )}
              </li>
            </ul>
          </nav>
        </header>
      </div>
      <Drawer
        title="Menu chức năng"
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <p>Quản lí tài khoản</p>
        <Divider />

        <p>Đăng xuất</p>
        <Divider />
      </Drawer>
    </>
  );
};

export default Header;
