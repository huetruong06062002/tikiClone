import { Button, Checkbox, Divider, Form, Input, InputNumber, message, notification } from "antd";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callLogin, callRegister } from '../../services/api';



const LoginPage = () => {
  const navigate =  useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish = async (values) => {
    const {username, password } = values;
    console.log(username, password);
    setIsSubmit(true);
    const res = await callLogin(username, password);
    console.log(res);
    setIsSubmit(false);
    if(res?.data) {
      localStorage.setItem('access_token', res.data.access_token);
      console.log('>>> check res:', res)
      message.success('Đăng nhập tài khoản thành công');
      navigate('/');
    }else{
      notification.error({
        message: 'Có lỗi xảy ra',
        description: res.data && Array.isArray(message) ? res.message[0] : res.message,
        duration: 5
      })
    }
  };

  return (
    <div
    className="register-page"
    style={{
      width: "100%",
      height: "100vh",
      padding: "3.125rem 3.125rem 4rem 3.125rem",
      backgroundColor: "#ecf0f1",
      overflowX: "hidden",
    }}
  >
    <div
      style={{
        width: "37.5rem",
        margin: "0 auto",
        backgroundColor: "#fff",
        textAlign: "center",
        paddingBottom: "4rem",
      }}
    >
      <h2 style={{ paddingTop: "2rem" }}>Đăng Nhập Tài Khoản</h2>
      <Divider/>
      <Form
        name="basic"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          margin: "5rem",
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >       
        <Form.Item
          label="User name"
          name="username"
          labelCol={{
            span: 24,
          }}
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input style={{ width: "27.813rem" }} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          labelCol={{
            span: 24,
          }}
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password style={{ width: "27.813rem" }} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={isSubmit}>
          Đăng nhập
        </Button>
        <p>Chưa có tài khoản? <Link to="/register">Đăng Ký</Link></p>
      </Form>
    </div>
  </div>
  )
}

export default LoginPage