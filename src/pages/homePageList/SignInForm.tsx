import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { LoadingOutlined, LockOutlined, UserOutlined, WindowsFilled, FacebookFilled, TwitterCircleFilled, GoogleCircleFilled } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Row } from 'antd';
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
                localStorage.setItem('roles', response.data.roles[0])
                localStorage.setItem('id', response.data.id)
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
                        LOGIN
                    </Button>
                </Form.Item>
                
                <div style={{textAlign: "center"}}>
                    <p style={{fontSize: 12, marginBottom: 0}}>Or Sign Up Using</p>
                    <Row style={{justifyContent: "center", fontSize: 32}}>
                        <Link to="#" className='social-icon'><FacebookFilled style={{color: "#415994"}}/></Link> 
                        <Link to="#" className='social-icon'><TwitterCircleFilled style={{color: "#46a1e7"}}/></Link> 
                        <Link to="#" className='social-icon'><GoogleCircleFilled style={{color: "#db5141"}}/></Link> 
                    </Row>
                </div>
                <div style={{fontSize: 12, textAlign: "center", marginTop: 50}}>
                    <p style={{marginBottom: 0}}>Or Sign Up Using</p>
                    <Link to="/signUp">SIGN UP</Link>
                </div>
            </Form>
        </>
    )
}

export default SignIn
