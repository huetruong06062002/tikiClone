import React, { useState } from 'react';
import { Button, Modal, Tabs } from 'antd';
import UserInfo from './UserInfo';
import ChangePassword from './ChangePassword';
const ManageAccount = (props) => {
  const {isModalOpenManageAccount, setIsModalOpenManageAccount} = props;

  const items = [
    {
      key: 'info',
      label: `Cập nhật thông tin`,
      children:<UserInfo/>,
    },
    {
      key: 'password',
      label: `Đổi mật khẩu`,
      children: <ChangePassword/>,
    }
  ]

  return (
    <>
      <Modal
        title="Quản lí tài khoản"
        open={isModalOpenManageAccount}
        footer={null}
        onCancel={() => setIsModalOpenManageAccount(false)}
        maskClosable={false}
        width={"60vw"}
      >
        <Tabs
          defaultActiveKey='info'
          items={items}
        />
      </Modal>
    </>
  );
};
export default ManageAccount;