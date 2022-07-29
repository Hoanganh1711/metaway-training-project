/* eslint-disable jsx-a11y/anchor-is-valid */
import 'antd/dist/antd.css';
import "../../index.css"
import axios from 'axios';
import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    Modal,
    Row,
} from 'antd';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

function SignUp() {

    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
    };

    const [inputFirstName, setInputFirstName] = useState('')
    const [inputLastName, setInputLastName] = useState('')
    const [inputUserName, setInputUserName] = useState('')
    const [inputPassWord, setInputPassWord] = useState('')
    const [inputEmail, setInputEmail] = useState('')

    const handleInputFirstName = (e: any) => {
        setInputFirstName(e.target.value)
    }

    const handleInputLastName = (e: any) => {
        setInputLastName(e.target.value)
    }

    const handleInputUsername = (e: any) => {
        setInputUserName(e.target.value);
    }

    const handleInputPassword = (e: any) => {
        setInputPassWord(e.target.value);
    }

    const handleInputEmail = (e: any) => {
        setInputEmail(e.target.value)
    }

    const SingUp = () => {
        axios.post('https://heroku-done-all-manager.herokuapp.com/api/auth/signup', {
            firstname: inputFirstName,
            lastname: inputLastName,
            username: inputUserName,
            email: inputEmail,
            password: inputPassWord,
        })
            .then(response => {
                console.log(response);
                success()
            })
            .catch(error => {
                console.log(error);
            })
    }

    const navigate = useNavigate();

    const success = () => {
        Modal.success({
            content: 'Đăng ký thành công!',
        });
        navigate("/signIn")
    };

    return (
        <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            scrollToFirstError
        >
            <h2>Sign Up</h2>
            <p>Please fill in this form to create an account!</p>
            <Divider />
            <Row>
                <Col span={12}>
                    <Form.Item
                        name="First Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your First Name!',
                            },
                        ]}
                    >
                        <Input placeholder='First Name' onChange={handleInputFirstName} />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="Last Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Last Name!',
                            },
                        ]}
                    >
                        <Input placeholder='Last Name' onChange={handleInputLastName} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="username"
                rules={[
                    {
                        required: true,
                        message: 'Please input your User Name!',
                    },
                ]}
            >
                <Input placeholder='User Name' onChange={handleInputEmail} />
            </Form.Item>

            <Form.Item
                name="email"
                rules={[
                    {
                        type: "email",
                        message: 'The input is not valid Email!',
                    },
                    {
                        required: true,
                        message: 'Please input your Email!',
                    },
                ]}
            >
                <Input placeholder='Email' onChange={handleInputEmail} />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                ]}
                hasFeedback
            >
                <Input.Password placeholder='Password' onChange={handleInputPassword} />
            </Form.Item>

            <Form.Item
                name="confirm"
                dependencies={['password']}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }

                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                        },
                    }),
                ]}
            >
                <Input.Password placeholder='Comfirm Password' />
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Button onClick={SingUp} type="primary" htmlType="submit">
                    SIGN UP
                </Button>
            </Form.Item>
        </Form>
    )
}

export default SignUp