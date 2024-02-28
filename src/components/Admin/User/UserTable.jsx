import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button, ConfigProvider } from 'antd';
import InputSearch from './InputSearch';
import { callFetchListUsers } from '../../../services/api';
import { CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, ExportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import UserViewDetail from './UserViewDetail';
import moment from 'moment';
import UserModalCreate from './UserModalCreate';
import UserImport from './data/UserImport';

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
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalImport, setOpenModalImport] = useState(false);


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
            title: 'Thời gian tạo',
            dataIndex: 'createdAt',
            sorter: true,
            render: (text, record, index) => {
                return <>
                        {moment(record?.createdAt).format('DD-MM-YYYY hh:mm:ss')}
                </>
            }
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

    const handleRefresh = () =>{
        setFilter("");
        setSortQuery("");
        setCurrent(1);
        fetchUser()
    }


    const renderHeader = () => {
        return (
            <>
               <div style={{display:'flex', justifyContent:'space-between'}}>
                <div>
                    Table list User
                </div>
                <div style={{display:'flex', gap: '0.5rem'}}>
                    <ConfigProvider
                        theme={{
                            token:{
                                colorPrimary: '#00b96b',
                            },
                        }}
                    >
                        <Button type='primary' onClick={() => {setOpenModalCreate(true)}}><PlusOutlined/>Add</Button>
                    </ConfigProvider>
                    <ConfigProvider
                        theme={{
                            token:{
                                colorPrimary: '#7f8c8d',
                            },
                        }}
                    >
                        <Button type='primary' icon={<ExportOutlined />}>Export</Button>
                    </ConfigProvider>
                    <ConfigProvider
                        theme={{
                            token:{
                                colorPrimary: '#f1c40f',
                            },
                        }}
                    >
                        <Button type='primary' icon={<CloudUploadOutlined/>} 
                            onClick={() => {setOpenModalImport(true)}}
                        >Import</Button>
                    </ConfigProvider>
                    <Button type="ghost" onClick={() => handleRefresh()}><ReloadOutlined/></Button>
                </div>
             </div>
            </>
        )
    }

    return (
        <>
         
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <InputSearch handleSearch={handleSearch} />
                </Col>
                <Col span={24}>
                    <Table
                        title={renderHeader}
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
                            total: total ,
                            showTotal: (total, range) => {return <div> {range[0]}-{range[1]} trên {total}</div>}
                            }
                        }
                    />
                </Col>
            </Row>
            <UserModalCreate
                openModalCreate = {openModalCreate}
                setOpenModalCreate = {setOpenModalCreate}
                fetchUser={fetchUser}
            />
            <UserViewDetail
                openViewDetail = {openViewDetail}
                setOpenViewDetail = {setOpenViewDetail}
                dataViewDetail = {dataViewDetail}
                setDataViewDetail = {setDataViewDetail}
            />
            <UserImport
                openModalImport={openModalImport}
                setOpenModalImport={setOpenModalImport}
            />
        </>
    )
}


export default UserTable;