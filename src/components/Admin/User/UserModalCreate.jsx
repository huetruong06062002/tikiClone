import { Button, Modal,  Form, Input, message, notification, Divider } from 'antd';
import { useState } from 'react';
import { callCreateAUser } from '../../../services/api';

const UserModalCreate = (props) => {
  const {openModalCreate, setOpenModalCreate} = props;
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const {fullName, password, email, phone} = values;
    setIsSubmit(true);
    const res= await callCreateAUser(fullName, password, email, phone);
    if(res && res.data){
      message.success('Tạo mới user thành công');
      form.resetFields();
      setOpenModalCreate(false);
      await props.fetchUser();
    } else {
      notification.error({
        message: 'Đã có lỗi xảy ra',
        description: res.message
      })
    }

    setIsSubmit(false);
  }

  return (
    <>
      <Modal 
      title="Basic Modal" 
      open={openModalCreate} 
      onOk={() => form.submit()} 
      onCancel={() => setOpenModalCreate(false)}
      okText={"Tạo mới"}
      cancelText= {"Hủy"}
      confirmLoading={isSubmit}
      >
        <Divider/>
        <Form
          form={form}
          name="basic"
          style={{maxWidth: 600}}
          onFinish={onFinish}
          autoComplete='off'
        >
          <Form.Item
            labelCol={{span: 24}}
            label="Tên hiển thị"
            name="fullName"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên hiển thị!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            labelCol={{span: 24}}
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!',
              },
            ]}
          >
            <Input.Password />
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
                message: "Vui lòng nhập email!",
              },
            ]}
          >
            <Input />
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
                message: "Vui lòng nhập số điện thoại!",
              },
            ]}
          >
            <Input/>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default UserModalCreate