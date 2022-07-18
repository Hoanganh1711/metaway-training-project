/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import "../../index.css"
import { Link } from 'react-router-dom';
import axios from 'axios';

function SignIn() {

    const [userName, setUserName] = useState("")
    const [passWord, setPassWord] = useState("")

    const [token, setToken] = useState('')

    const onFinish = (values: any) => {
        console.log(values);
        setUserName(values.username)
        setPassWord(values.password)
    };

    const logInApi = () => {
        axios.post('https://heroku-manager-news.herokuapp.com/api/auth/signin', {
            username: userName,
            password: passWord,
        })
            .then(response => {
                console.log(response);
                console.log(response.data.token);
                setToken(response.data.token)
                localStorage.setItem('token', token)
            })
            .catch(error => {
                console.log("error", error);
            })
    }


    return (
        <Form
            name="normal_login"
            className="signin-form"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
        >
            <Form.Item
                name="username"
                rules={[
                    {
                        required: true,
                        message: 'Please input your Username!',
                    },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your Password!',
                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <a className="login-form-forgot" href="">
                    Forgot password
                </a>
            </Form.Item>

            <Form.Item>
                <Button onClick={logInApi} type="primary" htmlType="submit" className="login-form-button">
                    Log in
                </Button>
            </Form.Item>
            Or <Link to="/signUp">register now!</Link>
        </Form>
    )
}

export default SignIn