import React, { useEffect, useState } from 'react';
import { Table, Row, Col } from 'antd';
import InputSearch from './InputSearch';
import { callFetchListUsers } from '../../../services/api';

// https://stackblitz.com/run?file=demo.tsx
const UserTable = () => {
    const [listUser, setListUser] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
        },
        {
            title: 'Tên hiển thị ',
            dataIndex: 'fullName',
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: true
        },
        {
            title: 'Action',
            render: (text, record, index) => {
                return (
                    <button>Delete</button>
                )
            }
        }
    ];

    useEffect(() => {
        fetchUser()
    }, [current, pageSize])

    const fetchUser = async(searchFilter) => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if(searchFilter){
            query += `&${searchFilter}`
        }
        console.log(query);
        const res = await callFetchListUsers(query);
        if(res && res.data) {
            setListUser(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    }

    const onChange = (pagination, filters, sorter, extra) => {
        if(pagination && pagination.current !== current){
            setCurrent(pagination.current);
        }
        if(pagination && pagination.pageSize !== pageSize){
            setPageSize(pagination.pageSize);
            setCurrent(1)
        }
        console.log('params', pagination, filters, sorter, extra);
    };

    const handleSearch = (query) => {
        fetchUser(query);
    }

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <InputSearch handleSearch={handleSearch} />
                </Col>
                <Col span={24}>
                    <Table
                        className='def'
                        loading={isLoading}
                        columns={columns}
                        dataSource={listUser}
                        onChange={onChange}
                        pagination={
                            { 
                            current : current, 
                            pageSize: pageSize, 
                            showSizeChanger : true, 
                            total: total 
                            }
                        }
                    />
                </Col>
            </Row>
        </>
    )
}


export default UserTable;