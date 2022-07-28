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
                // const history = useHistory()
                console.log(response);
                console.log(response.data.token);
                const token = response.data.token
                setToken(token)
                localStorage.setItem('token', token)
                // localStorage.setItem('name', response.data.username)
                // localStorage.setItem('email', response.data.email)
                localStorage.setItem('roles', response.data.roles[0])
                console.log(response.data.roles[0]);

                setTimeout(() => {
                    navigate('/')
                    window.location.reload()
                }, 1000)
            })
            .catch(error => {
                console.log("error", error);
                setError("Tên tài khoản hoặc mật khẩu chưa đúng !")
            })
    }


    return (
        <>
            <Form
                name="normal_login"
                className="signin-form"
                layout="vertical"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <h2 className='form-heading'>LOGIN</h2>
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Username!',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Type your username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
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
                        placeholder="Type your Password"
                    />
                </Form.Item>

                <span className='error' style={{ color: "red " }}>
                    {error}
                </span>
                <div className='forgot-pass'>
                    <Link to="#" >Forgot password?</Link>
                </div>

                <Form.Item style={{ textAlign: "center" }}>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                </Form.Item>
                Hoặc <Link to="/signUp">đăng ký ngay</Link>
            </Form>
        </>
    )
}

export default SignIn
