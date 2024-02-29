import React, { useState } from 'react';
import { Badge, Button, Descriptions, Drawer } from 'antd';
import moment from 'moment';
import { FORMAT_DATE_DISPLAY } from '../../../utils/contanst';

const UserViewDetail = (props) => {
  const {openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail} = props;


  console.log(dataViewDetail)


  const onClose = (e) => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  }

  return (
    <>
     <Drawer
      title="Chức năng xem chi tiết"
      width="50vw"
      onClose={onClose}
      open={openViewDetail}
    >
      <Descriptions
        title="Thông tin user"
        bordered
        column={2}
      >
        <Descriptions.Item label="Id">{dataViewDetail?.id}</Descriptions.Item>
        <Descriptions.Item label="Tên hiển thị">{dataViewDetail?.fullName}</Descriptions.Item>
        <Descriptions.Item label="Email">{dataViewDetail?.email}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{dataViewDetail?.phone}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại" span={2}>
            <Badge status="processing" text ={dataViewDetail?.role}/>
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
           {moment(dataViewDetail?.createAt).format(FORMAT_DATE_DISPLAY)}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
           {moment(dataViewDetail?.updatedAt).format(FORMAT_DATE_DISPLAY)}
        </Descriptions.Item>
      </Descriptions>
      </Drawer>
    </>
  )
}

export default UserViewDetail