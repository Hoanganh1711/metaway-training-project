/* eslint-disable jsx-a11y/alt-text */
import { Col, Input, Row } from 'antd'
import React from 'react'
import 'antd/dist/antd.css';
import "./index.css"
import { Link } from 'react-router-dom';

const { Search } = Input;

const onSearch = (value: string) => console.log(value);

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
                <Row className='header-buttons'>
                    <Link to="/signIn" className='login-btn'>Đăng nhập</Link>
                    {/* <Link to="/signUp" className='register-btn'>Đăng ký</Link> */}
                </Row>
            </Col>
        </Row>
    )
}

export default Header