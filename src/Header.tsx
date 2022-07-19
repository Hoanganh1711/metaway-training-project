/* eslint-disable jsx-a11y/alt-text */
import { Avatar, Col, Input, Row } from 'antd'
import React from 'react'
import 'antd/dist/antd.css';
import "./index.css"
import { Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';

const { Search } = Input;

const onSearch = (value: string) => console.log(value);

const isToken = localStorage.getItem("token")
const userName = localStorage.getItem('name')
console.log(isToken)

const clearToken = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("name")
    window.location.reload()
}

const menu = (
    <Menu
        items={[
            {
                key: '1',
                label: (
                    <Link rel="noopener noreferrer" to="/Manager/UsersInfo">
                        Thông tin cá nhân
                    </Link>
                ),
            },
            {
                key: '2',
                label: (
                    <a rel="noopener noreferrer" href="https://www.aliyun.com">
                        Quản lý bài viết
                    </a>
                ),
            },
            {
                key: '3',
                label: (
                    <a rel="noopener noreferrer" href="https://www.luohanacademy.com">
                        Thêm bài viết mới
                    </a>
                ),
            },
        ]}
    />
);

function Header() {
    return (
        <Row className='header'>
            <Col>
                <Link to="/">
                    <img className='header-logo' src='https://cdn.logo.com/hotlink-ok/logo-social.png'></img>
                </Link>
            </Col>
            <Col>
                <Row className='search-group'>
                    <Search placeholder="Tìm kiềm" onSearch={onSearch}
                        style={{ width: 300, borderLeft: "none" }}
                        enterButton
                    />
                </Row>
            </Col>
            <Col>
                {!isToken ?
                    <Row className='header-buttons'>
                        <div className='login-box'>
                            <Link to="/signIn" className='login-btn'>Đăng nhập</Link>   
                        </div>
                    </Row>
                    :
                    <Row className='header-buttons'>
                        <div style={{ marginRight: 20, textAlign: "center" }}>
                            <Dropdown overlay={menu} placement="bottom" arrow>
                                <div>
                                    <Avatar style={{marginBottom: 3}} size={36} icon={<UserOutlined />} /><br></br>
                                    <span style={{backgroundColor: "#fff", borderRadius: 20, padding: "0 4px" ,cursor: "pointer"}}>{userName}</span>
                                </div>
                            </Dropdown>
                        </div>
                        <div className='logout-box'>
                            <Link onClick={clearToken} to="#" className='logout-btn'>Đăng xuất</Link>
                        </div>
                    </Row>
                }

            </Col>
        </Row>
    )
}

export default Header