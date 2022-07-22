/* eslint-disable jsx-a11y/alt-text */
import { Avatar, Col, Input, Row } from "antd";
import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu } from "antd";

const { Search } = Input;

const onSearch = (value: string) => console.log(value);

const isToken = localStorage.getItem("token");
const userName = localStorage.getItem("name");
console.log(isToken);

const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
  localStorage.removeItem("roles");
  window.location.reload();
};

const menu = (
  <Menu
    items={[
      {
        key: "1",
        label: (
          <Link rel="noopener noreferrer" to="/Manager/UsersInfo">
            <b style={{ color: '#3d4d65' }}>Thông tin cá nhân</b>
          </Link>
        ),
      },
      {
        key: "2",
        label: (
          <Link rel="noopener noreferrer" to="/Manager/NewsManager">
            <b style={{ color: '#3d4d65' }}>Quản lý bài viết</b>
          </Link>
        ),
      },
      {
        key: "3",
        label: (
          <Link rel="noopener noreferrer" to="/Manager/CreateNewsForm">
            <b style={{ color: '#3d4d65' }}>Thêm bài viết mới</b>
          </Link>
        ),
      },
      {
        key: "4",
        label: (
          <Link onClick={clearToken} rel="noopener noreferrer" to="#">
            <b style={{ color: '#3d4d65' }}>Đăng xuất</b>
          </Link>
        ),
      },
    ]}
  />
);

function Header() {
  return (
    <Row className="header">
      <Col>
        <Link to="/">
          <img
            className="header-logo"
            src="https://cdn.logo.com/hotlink-ok/logo-social.png"
          ></img>
        </Link>
      </Col>
      <Col>
        <Row className="search-group">
          <Search
            placeholder="Tìm kiềm"
            onSearch={onSearch}
            style={{ width: 400, borderLeft: "none" }}
            enterButton
          />
        </Row>
      </Col>
      <Col>
        {!isToken ? (
          <Row className="header-buttons">
            <div className="login-box">
              <Link to="/signIn" className="login-btn">
                Đăng nhập
              </Link>
            </div>
          </Row>
        ) : (
          <Row className="header-buttons">
            <div style={{ marginRight: 20, textAlign: "center" }}>
              <Dropdown overlay={menu} placement="bottom" arrow>
                <div style={{ cursor: "pointer" }}>
                  <Avatar
                    style={{ marginBottom: 3 }}
                    size={36}
                    icon={<UserOutlined />}
                  />
                </div>
              </Dropdown>
            </div>
          </Row>
        )}
      </Col>
    </Row>
  );
}

export default Header;
