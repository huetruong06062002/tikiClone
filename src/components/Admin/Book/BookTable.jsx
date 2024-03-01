import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button, ConfigProvider, Popconfirm, notification, message } from 'antd';
import InputSearch from './InputSearch';
import { callDeleteBook, callDeleteUser, callFetchListBooks, callFetchListUsers } from '../../../services/api';
import { CloudDownloadOutlined, CloudUploadOutlined, DeleteOutlined, DeleteTwoTone, EditOutlined, EditTwoTone, ExportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import * as XLSX from 'xlsx';
import BookViewDetail from './BookViewDetail';
import BookModalCreate from './BookModalCreate';
import BookModalUpdate from './BookModalUpdate';

// https://stackblitz.com/run?file=demo.tsx
const BookTable = () => {
    const [listBook, setListBook] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

    const [dataViewDetail, setDataViewDetail] = useState({})
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalImport, setOpenModalImport] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});

    console.log(dataUpdate);
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
            title: 'Tên Sách',
            dataIndex: 'mainText',
            sorter: true,
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            sorter: true
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            sorter: true
        },
        {
          title: 'Giá tiền',
          dataIndex: 'price',
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
                    <div>
                        <Popconfirm
                            placement='leftTop'
                            title={"Xác nhận xóa sách"}
                            description={"Bạn có chắc chắn muốn xóa sách này ?"}
                            onConfirm={() => handleDeleteBook(record._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{cursor: "pointer", margin: "0 20px"}}>
                                <DeleteTwoTone twoToneColor="#ff4d4f"/>
                            </span>
                        </Popconfirm> 
                        <EditTwoTone
                            twoToneColor="#c0392b"
                            style={{cursor: "pointer"}}
                            onClick={() => 
                            {
                                setDataUpdate(record)
                                setOpenModalUpdate(true)} 
                            }
                        />                      
                    </div>
                )
            }
        }
    ];

    useEffect(() => {
        fetchBook()
    }, [current, pageSize , filter, sortQuery])

    const fetchBook = async(searchFilter) => {
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
        const res = await callFetchListBooks(query);
        if(res && res.data) {
            setListBook(res.data.result);
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
        fetchBook(query);
    }

    const handleRefresh = () =>{
        setFilter("");
        setSortQuery("");
        setCurrent(1);
        fetchBook()
    }

    const handleExportData = ()=> {
        if(listUser.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listUser);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
            //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
            XLSX.writeFile(workbook, "DataSheet.xlsx");
        }
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
                        <Button type='primary' icon={<ExportOutlined />} onClick={() => handleExportData()}>Export</Button>
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


    const handleDeleteBook = async(bookId) => {
        const res = await callDeleteBook(bookId);
        if(res && res.data) {
            message.success('Xóa book thành công')
            props.fetchBook()
        }else{
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message,
            })
        }
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
                        dataSource={listBook}
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
            <BookViewDetail
              openViewDetail = {openViewDetail}
              setOpenViewDetail = {setOpenViewDetail}
              dataViewDetail = {dataViewDetail}
              setDataViewDetail = {setDataViewDetail}
            />
            <BookModalCreate
              openModalCreate= {openModalCreate}
              setOpenModalCreate = {setOpenModalCreate}
              fetchBook = {fetchBook}
            />
            <BookModalUpdate
              openModalUpdate={openModalUpdate}
              setOpenModalUpdate={setOpenModalUpdate}
              dataUpdate={dataUpdate}
              setDataUpdate={setDataUpdate}
              fetchBook={fetchBook}
            />
        </>
    )
}


export default BookTable;