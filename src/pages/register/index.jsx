import { Button, Checkbox, Divider, Form, Input, InputNumber, message, notification } from "antd";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callRegister } from '../../services/api';


const RegisterPage = () => {
  const navigate =  useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish = async (values) => {
    const {fullName, email, password, phone} = values;
    console.log(fullName, email, password, phone)

    const res = await callRegister(fullName, email, password, phone);
    console.log(res);
    setIsSubmit(false);
    if(res?.data?._id) {
      message.success("Đăng kí tài khoản thành công");
      navigate("/login");
    }else{
      notification.error(
        {
          message: "Có lỗi xảy ra",
          description: res.message && res.message.length ? res.message[0] : res.message,
          duration: 5,
        }
      )
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
        <h2 style={{ paddingTop: "2rem" }}>Đăng Ký Tài Khoản</h2>
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
            label="Họ tên"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input style={{ width: "27.813rem" }} />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            labelCol={{
              span: 24,
            }}
            rules={[
              {
                required: true,
                message: "Please input your email!",
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
          <Form.Item
            label="Phone"
            name="phone"
            labelCol={{
              span: 24,
            }}
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
            ]}
          >
            <Input style={{ width: "27.813rem" }} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={isSubmit}>
            Đăng ký
          </Button>
          <p>Đã có tài khoản? <Link to="/login">Đăng Nhập</Link></p>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
