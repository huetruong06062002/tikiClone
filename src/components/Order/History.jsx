import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, message } from 'antd';
import { callHistory } from '../../services/api';
import ReactJson from 'react-json-view'

const History = () => {
  const [historyBook, setHistoryBook] = useState([]);
  
  const fetchHistoryBook = async () => {
    const res = await callHistory();
    if(res && res.data){
      message.success('Xem lịch sử thành công');
      setHistoryBook(res.data)
    }else{
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message
      })
    }
  }


  useEffect(() => {
    fetchHistoryBook();
  }, [])

  console.log(historyBook)
  
  const columns = [
    {
      title: 'Số thứ tự',
      dataIndex: '',
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Tổng số tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
    {
      title: 'Trạng thái',
      // key: 'tags',
      // dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          <Tag bordered={false} color="success">
              success
          </Tag>
        </>
      ),
    },
    {
      title: 'Chi tiết',
      dataIndex: 'detail',
      key: 'detail',
      render: (text, record, index) =>  <ReactJson name="Chi tiết mua đơn hàng" src={record.detail} />
     
    },
  ];
 ;
  
  return (<>
            <h1>Xem lịch sử đặt hàng</h1>
            <Table columns={columns} dataSource={historyBook} />     
          </>);
};

export default History;