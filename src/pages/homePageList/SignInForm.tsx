import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { LoadingOutlined, LockOutlined, UserOutlined, WindowsFilled } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import "../../index.css"
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function SignIn() {

    // const [userName, setUserName] = useState("")
    // const [passWord, setPassWord] = useState("")

    const [token, setToken] = useState('')

    const [error, setError] = useState("")


    const navigate = useNavigate();
    // const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    const onFinish = (values: any) => {
        logInApi(values.username, values.password)
    };

    const logInApi = (userName: string, passWord: string) => {
        axios.post('https://heroku-done-all-manager.herokuapp.com/api/auth/signin', {
            username: userName,
            password: passWord,
        })
            .then(response => {
                console.log(response);
                console.log(response.data.token);
                setToken(response.data.token)
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('name', response.data.username)
                localStorage.setItem('email', response.data.email)
                
                setTimeout(() => {
                    navigate('/')
                    window.location.reload()
                }, 1000)
            })
            .catch(error => {
                console.log("error", error);
                setError("Tên tài khoản hoặc mật khẩu chưa đúng !")
            })
        // navigate('/')
    }


    return (
        <>
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

                <span className='error' style={{ color: "red " }}>
                    {error}
                </span>

                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <a className="login-form-forgot" href="">
                        Forgot password
                    </a>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                </Form.Item>
                Or <Link to="/signUp">register now!</Link>
            </Form>
        </>
    )
}

export default SignIn