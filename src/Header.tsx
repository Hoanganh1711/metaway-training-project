/* eslint-disable jsx-a11y/alt-text */
import { Avatar, Col, Divider, Input, Row } from "antd";
import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Link } from "react-router-dom";
import { HomeFilled, UserOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import axios from "axios";

const { Search } = Input;

const onSearch = (value: string) => console.log(value);

const isToken = localStorage.getItem("token");
// console.log(isToken);

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
                    <Link rel="noopener noreferrer" to="/Manager/MyInfo">
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
    const [categories, setCategories] = useState([])

    const categoriesAPI = async () => {
        await axios.get('https://heroku-done-all-manager.herokuapp.com/api/category/user/views')
            .then(response => {
                // console.log(response.data);
                setCategories(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        categoriesAPI()
    }, [])

    return (
        <div className="header">
            <div className="header-top">
                <Row className="top-header">
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
                            <Link to="/signIn" className="login-btn">
                                <UserOutlined /> Đăng nhập
                            </Link>
                        ) : (
                            <Row className="header-buttom">
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
            </div>
            <Divider className="divider" />
            <div className="header-bootom">
                <Row className="nav">
                    {categories.map((category: any) => {
                        if (category.name === "HOMEPAGE") {
                            category.name = <HomeFilled />;
                        } else if (category.name === "POLITICAL") {
                            category.name = "Chính trị";
                        } else if (category.name === "SOCIAL") {
                            category.name = "Xã hội";
                        } else if (category.name === "ECONOMY") {
                            category.name = "Kinh tế";
                        } else if (category.name === "HEALTH") {
                            category.name = "Sức khỏe";
                        } else if (category.name === "EDUCATION") {
                            category.name = "Giáo dục";
                        } else if (category.name === "LAW") {
                            category.name = "Pháp luật";
                        } else if (category.name === "SPORT") {
                            category.name = "Thể thao";
                        } else if (category.name === "WORLD") {
                            category.name = "Thế giới"
                        }
                        return (
                            <Link to="#" className="category" key={category.name}>{category.name}</Link>
                        )
                    })}
                </Row>
            </div>
        </div>

    );
}

export default Header;
