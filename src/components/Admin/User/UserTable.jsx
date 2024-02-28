import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button } from 'antd';
import InputSearch from './InputSearch';
import { callFetchListUsers } from '../../../services/api';
import { DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import UserViewDetail from './UserViewDetail';

// https://stackblitz.com/run?file=demo.tsx
const UserTable = () => {
    const [listUser, setListUser] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("");
    const [dataViewDetail, setDataViewDetail] = useState({})
    const [openViewDetail, setOpenViewDetail] = useState(false);

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            render: (text, record, index) => {
                return (
                    <a href="#" 
                    onClick={() => {
                        setDataViewDetail(record);
                        setOpenViewDetail(true);
                    }}
                    >
                        {record._id}
                    </a>
                )
            }
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
                    <>
                    <Button type="link"><DeleteOutlined /></Button>
                    </>
                )
            }
        }
    ];

    useEffect(() => {
        fetchUser()
    }, [current, pageSize , filter, sortQuery])

    const fetchUser = async(searchFilter) => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if(filter) {
            query += `&${filter}`;
        }

        if(sortQuery) {
            query += `&${sortQuery}`;
        }

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
        if(sorter && sorter.field){
            const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`;
            setSortQuery(q);
        }

        console.log('params', pagination, filters, sorter, extra);
    };

    const handleSearch = (query) => {
        fetchUser(query);
    }

    return (
        <>
            <Row style={{display:'flex', gap:'0.5rem',position: 'relative', right: 0}}>
                <Button><PlusOutlined/></Button>
                <Button type="ghost" onClick={() => {
                    setFilter("");
                    setSortQuery("");
                }}><ReloadOutlined/></Button>
            </Row>
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
            <UserViewDetail
                openViewDetail = {openViewDetail}
                setOpenViewDetail = {setOpenViewDetail}
                dataViewDetail = {dataViewDetail}
                setDataViewDetail = {setDataViewDetail}
            />
        </>
    )
}


export default UserTable;