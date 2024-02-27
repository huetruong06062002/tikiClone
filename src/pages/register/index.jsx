import { Button, Checkbox, Divider, Form, Input, InputNumber } from "antd";

const RegisterPage = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  return (
    <div
      className="register-page"
      style={{ width:"100%", height:"100vh", padding: "3.125rem 3.125rem 4rem 3.125rem", backgroundColor: "#ecf0f1" , overflowX: "hidden"}}
    >
      <div style={{width: "37.5rem", margin: "0 auto" , backgroundColor: "#fff", textAlign: "center", paddingBottom:"4rem"}}>
          <h1 style={{paddingTop: "2rem"}}>Đăng Ký Tài Khoản</h1>
        <Form
          name="basic"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{             
           margin:"5rem",
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
            <Input style={{width: "27.813rem"}}/>
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
            <Input style={{width: "27.813rem"}}/>
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
            <Input.Password style={{width: "27.813rem"}}/>
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
            <Input style={{width: "27.813rem"}}/>
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={true}>
              Register
            </Button>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
