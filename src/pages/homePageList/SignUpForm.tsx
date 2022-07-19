/* eslint-disable jsx-a11y/anchor-is-valid */
import 'antd/dist/antd.css';
import "../../index.css"
import axios from 'axios';
import {
  Button,
  Form,
  Input,
  Modal,
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

  const [inputUserName, setInputUserName] = useState('')
  const [inputPassWord, setInputPassWord] = useState('')
  const [inputEmail, setInputEmail] = useState('')

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
      username: inputUserName,
      password: inputPassWord,
      email: inputEmail
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
      className='signup-form'
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{
        residence: ['zhejiang', 'hangzhou', 'xihu'],
        prefix: '86',
      }}
      scrollToFirstError
    >
      <Form.Item
        name="userName"
        label="User Name"
        rules={[
          {
            required: true,
            message: 'Please input your User Name!',
          },
        ]}
      >
        <Input onChange={handleInputUsername} />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
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
        <Input onChange={handleInputEmail} />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password onChange={handleInputPassword} />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
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
        <Input.Password />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button onClick={SingUp} type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  )
}

export default SignUp