import React, { useState } from 'react'
import { Button, Form, Input, Space, Row, Col, Avatar, Upload, message, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AntCloudOutlined, UploadOutlined } from '@ant-design/icons';
import { callUpdateAvatar, callUpdateUserInfo } from '../../services/api';
import { doUpLoadAvatarAction, doUpdateUserInfoAction } from '../../redux/account/accountSlice';

const UserInfo= () => {
  const user = useSelector(state => state.account.user);
  const tempAvatar = user?.avatar;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  console.log(user)
  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatars/${tempAvatar || user?.avatar}`;

  const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "");
  const [isSubmit, setIsSubmit] = useState(false);


  const handleUploadAvatar = async({file, onSuccess, onError}) => {
    const res = await callUpdateAvatar(file);
    if(res && res.data) {
      const newAvatar = res.data.fileUploaded;
      dispatch(doUpLoadAvatarAction({avatar: newAvatar}));
      setUserAvatar(newAvatar);
      onSuccess("ok")
    }else {
      onError("Đã có lỗi khi upload file")
    }
  }

  const propsUpload = {
    maxCount: 1,
    multiple: false,
    showUpLoadList: false,
    customRequest: handleUploadAvatar,
    onChange(info) {
        if(info.file.status !== 'uploading') {

        }
        if(info.file.status === 'done') {
          message.success(`Upload file thành công`);
        }else if (info.file.status === 'error') {
          message.error(`Upload file thất bại`);
        }
    }
  }

  const onFinish = async(values) => {
    const _id = user?.id; 
    console.log(_id)
    const {fullName, phone} = values;
    setIsSubmit(true);
    const res = await callUpdateUserInfo(_id, phone, fullName, userAvatar);
    if(res && res.data) {
      //update redux
      dispatch(doUpdateUserInfoAction({avatar: userAvatar, phone, fullName}));
      message.success("Cập nhật thông tin user thành công");
      //force renew token
      localStorage.removeItem('access_token');
    }else{
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      })
    }
    setIsSubmit(false);

  }
  
  return (
    <div>
       <Row>
        <Col span={12} style={{display:'flex', flexDirection:'column', minHeight:400}}>    
          <Avatar 
            src={urlAvatar} 
            icon={<AntCloudOutlined/>}
            size={{sx: 32, sm: 64, md: 80, lg :120, xl:300}}
            shape="circle"
          />
          <div style={{height:"50px"}}></div>
          <Upload {...propsUpload}>
            <Button icon={<UploadOutlined />}>UpLoad Avatar</Button>
          </Upload>
        </Col>
        <Col span={12}>
          <Form onFinish={onFinish} name="validateOnly" layout="vertical" autoComplete="off">
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
                <Input  disabled/>
              </Form.Item>
              <Form.Item
                name="fullName"
                label="Tên hiển thị"
                initialValue={user.fullName}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                initialValue={user?.phone}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button htmlType="submit" loading={isSubmit}>Cập nhât</Button>
                </Space>
              </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  )
}

export default UserInfo
