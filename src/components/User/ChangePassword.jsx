import React, { useState } from "react";
import { useSelector } from "react-redux";
import { callUpdatePassword } from "../../services/api";
import {
  Button,
  Form,
  Input,
  Space,
  Row,
  Col,
  Avatar,
  Upload,
  message,
  notification,
} from "antd";

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const user = useSelector((state) => state.account.user);

  const onFinish = async (values) => {
    const { email, oldpass, newpass } = values;
    setIsSubmit(true);
    const res = await callUpdatePassword(email, oldpass, newpass);

    if (res && res.data) {
      message.success("Cập nhật thành công");
      form.setFieldValue("oldpass", "");
      form.setFieldValue("newpass", "");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }

    setIsSubmit(false);
  };

  return (
    <div>
      <Form
        onFinish={onFinish}
        name="validateOnly"
        layout="vertical"
        autoComplete="off"
      >
        {/* <Form.Item
                name="_id"
                label="id"
                initialValue={user._id}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input disabled/>
              </Form.Item> */}
        <Form.Item
          name="email"
          label="Email"
          initialValue={user.email}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="oldpass"
          label="Mật khẩu hiện tại"
          rules={[
            {
              required: true,
            },
          ]}
        >
         <Input.Password />
        </Form.Item>
        <Form.Item
          name="newpass"
          label="Mật khẩu mới"
          rules={[
            {
              required: true,
            },
          ]}
        >
         <Input.Password />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type='primary' htmlType="submit" loading={isSubmit}>
              Cập nhât
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
