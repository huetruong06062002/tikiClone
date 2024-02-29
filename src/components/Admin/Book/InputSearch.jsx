import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, theme } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const InputSearch = (props) => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();

    const formStyle = { 
        maxWidth: 'none',
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        padding: 24,
    };

    const onFinish = (values) => {
        let query = '';
        if(values.mainText) {
            query += `&mainText=/${values.mainText}/i`
        }
        if(values.author) {
            query += `&author=/${values.author}/i`
        }
        if(values.category){
            query += `&category=/${values.category}/i`
        }

        if(query){
            props.handleSearch(query);
        }
    };

    return (
        <Form form={form} name="advanced_search" style={formStyle} onFinish={onFinish}>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        labelCol={{ span: 24 }} //whole column
                        name={`mainText`}
                        label={`Tên sách`}
                    >
                        <Input placeholder="Tên sách" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        labelCol={{ span: 24 }} //whole column
                        name={`author`}
                        label={`Tác giả`}
                    >
                        <Input placeholder="Tác giả" />
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item
                        labelCol={{ span: 24 }} //whole column
                        name={`category`}
                        label={`Thể loại`}
                    >
                        <Input placeholder="Thể loại" />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit" >
                        Search
                    </Button>                
                    <Button style={{marginLeft:'1rem'}}>
                        Clear
                    </Button>
                    {/* <a
                        style={{ fontSize: 12 }}
                        onClick={() => {
                            setExpand(!expand);
                        }}
                    >
                        {expand ? <UpOutlined /> : <DownOutlined />} Collapse
                    </a> */}
                </Col>
            </Row>
        </Form>
    );
};


export default InputSearch;