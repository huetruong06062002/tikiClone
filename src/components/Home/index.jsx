import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination, Spin } from 'antd';
import './home.scss';
import { useEffect, useState } from 'react';
import { callFetchCategory, callFetchListBooks } from '../../services/api';
const Home = () => {
  
    const [listCategory, setListCategory] = useState([])


    const [listBook, setListBook] = useState([]);
    const [current, setCurrent] = useState(2);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-sold");

    const [form] = Form.useForm();


    useEffect(() => {
        const initCategory = async()=> {
            const res = await callFetchCategory();
            if(res && res.data) {
                const d = res.data.map(item => {
                    return {label: item, value: item}
                })
                setListCategory(d)
            }
        }
        initCategory()
    }, [])


  

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
        const res = await callFetchListBooks(query);
        if(res && res.data) {
            setListBook(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchBook()
    }, [current, pageSize , filter, sortQuery])

   

    const handleOnchangePage = (pagination) => {
        if(pagination && pagination.current !== current){
            setCurrent(pagination.current);
        }
        if(pagination && pagination.pageSize !== pageSize){
            setPageSize(pagination.pageSize);
            setCurrent(1)
        }

        console.log(pagination)

    }
    console.log(current);
    const items = [
        {
            key: 'sort=-sold',
            label: `Phổ biến`,
            children: <></>,
        },
        {
            key: 'sort=-updateAt',
            label: `Hàng Mới`,
            children: <></>,
        },
        {
            key: 'sort=price',
            label: `Giá Thấp Đến Cao`,
            children: <></>,
        },
        {
            key: 'sort=-price',
            label: `Giá Cao Đến Thấp`,
            children: <></>,
        },
    ];

    const handleChangeFilter = (changedValues, values) => {
        console.log(">>> check handleChangeFilter", changedValues, values)
    
        //only fire if category changes
        if(changedValues.category) {
            const cate = values.category;
            if(cate && cate.length > 0) {
                const f = cate.join(',');
                console.log(f);
                setFilter(`category=${f}`);
            } else{
                //reset data -> fetch api
                setFilter('');
            }
        }


    }
    console.log(filter)

    const onFinish=(values) => {
        console.log("check values", values)
        if(values?.range?.from >= 0 && values?.range?.to >= 0){
            let f = `price>=${values?.range?.from}&price<=${values?.range?.to}`;
            if(values?.category?.length){
                const cate = values?.category?.join(',');
                f+= `&category${cate}`;
            }
            setFilter(f);
        }
    }
    return (
        <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
            <Row gutter={[20, 20]}>
                <Col md={4} sm={0} xs={0}>
                    <div style={{ display: 'flex', justifyContent: "space-between" }}>
                        <span> <FilterTwoTone /> Bộ lọc tìm kiếm</span>
                        <ReloadOutlined title="Reset" 
                        onClick={() => {
                            form.resetFields();
                            setFilter('');
                        }}
                        />
                    </div>
                    <Form
                        onFinish={onFinish}
                        form={form}
                        onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                    >
                        <Form.Item
                            name="category"
                            label="Danh mục sản phẩm"
                            labelCol={{ span: 24 }}
                        >
                            <Checkbox.Group>
                                <Row>
                                    {listCategory?.map((item, index) => {
                                        return (
                                            <Col span={24} key={`index-${index}`} style={{padding:'7px 0'}}>
                                                <Checkbox value={item.value} >
                                                    {item.label}
                                                </Checkbox>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                        <Divider />
                        <Form.Item
                            label="Khoảng giá"
                            labelCol={{ span: 24 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                <Form.Item name={["range", 'from']}>
                                    <InputNumber
                                        name='from'
                                        min={0}
                                        placeholder="đ ĐẾN"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                                <span >-</span>
                                <Form.Item name={["range", 'to']}>
                                    <InputNumber
                                        name='to'
                                        min={0}
                                        placeholder="đ ĐẾN"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                </Form.Item>
                            </div>
                            <div>
                                <Button onClick={() => form.submit()}
                                    style={{ width: "100%" }} type='primary'>Áp dụng</Button>
                            </div>
                        </Form.Item>
                        <Divider />
                        <Form.Item
                            label="Đánh giá"
                            labelCol={{ span: 24 }}
                        >
                            <div>
                                <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text"></span>
                            </div>
                            <div>
                                <Rate value={4} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text">trở lên</span>
                            </div>
                            <div>
                                <Rate value={3} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text">trở lên</span>
                            </div>
                            <div>
                                <Rate value={2} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text">trở lên</span>
                            </div>
                            <div>
                                <Rate value={1} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                <span className="ant-rate-text">trở lên</span>
                            </div>
                        </Form.Item>
                    </Form>
                </Col>
                <Col md={20} xs={24}>
                    <Spin spinning={isLoading} tip="Loading...">
                        <div style={{padding: "20px", backgroundColor:"#fff", borderRadius: 5}}>
                            <Row>
                                <Tabs 
                                    defaultActiveKey="sort=-sold" 
                                    items={items}
                                    onChange={(value) => {setSortQuery(value)}}
                                    style={{overflowX: "auto"}}
                                />
                            
                            </Row>
                            <Row className='customize-row'>
                                {
                                    listBook?.map((item, index) => {
                                        return (
                                            <div className="column" key={`book-${index}`}>
                                                <div className='wrapper'>
                                                    <div className='thumbnail'>
                                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`} alt="thumbnail book" />
                                                    </div>
                                                    <div className='text'>{item.mainText}</div>
                                                    <div className='price'>
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                                    </div>
                                                    <div className='rating'>
                                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                        <p>Đã bán</p>
                                                        <span>{item.sold}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }           
                            </Row>
                            <Divider />
                            <Row style={{ display: "flex", justifyContent: "center" }}>
                                <Pagination
                                    current={current}
                                    total={total}
                                    pageSize={pageSize} 
                                    responsive
                                    onChange={(p, s) => handleOnchangePage({current: p, pageSize: s})}
                                />
                            </Row>
                        </div>
                    </Spin>
                </Col>
            </Row>
        </div>
    )
}

export default Home;