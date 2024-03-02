import { Col, Divider, Form, Input, Space, InputNumber, Row, Button, message, notification, Empty  } from 'antd';
import './order.scss';
import { DeleteOutlined, DeleteTwoTone, LoadingOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { doDeleteItemCartAction, doPlaceOrderAction, doUpdateCartAction } from '../../redux/order/orderSlice';
import TextArea from 'antd/es/input/TextArea';
import { callPlaceOrder } from '../../services/api';

const Payment = (props) => {
    const {setCurrentStep} = props;
    const carts = useSelector((state) => state.order.carts);
    const user = useSelector((state) => state.account.user);
    const [totalPrice, setTotalPrice] = useState(0);
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const lengthCard = carts.length;
    const onFinish = async(values) => {
      setIsSubmit(true);
      const detailOrder = carts.map(item => {
          return {
            "bookName": item.detail.mainText,
            "quantity": item.detail.quantity,
            "_id": item._id
          }
      })
      const data = {
        "name": "test",
        "address": "ha noi",
        "phone": "123456789",
        "totalPrice": 123,
        "detail": detailOrder
      }
      const res = await callPlaceOrder(data)
      if(res && res.data){
        message.success('Đặt hàng thành công');
        dispatch(doPlaceOrderAction());
        setCurrentStep(2)
      }else{
        notification.error({
          message: "Đã có lỗi xảy ra",
          description: res.message
        })
      }
      setIsSubmit(false);
      
    }

    useEffect(() => {
        if(carts && carts.length){
            let sum = 0;
            carts.map(item => {
                sum += item.quantity * item.detail.price;
            })
            setTotalPrice(sum)
        }else {
            setTotalPrice(0)
        }
    }, [carts])
    return (
      <div style={{ background: '#efefef', padding: "20px 0" }}>
        {carts.length !== 0 && (  
          <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
              <Row gutter={[20, 20]}>
                  <Col md={18} xs={24}>
                      {carts.map((book =>                            
                          {
                              const currentBookPrice = book?.detail?.price ?? 0;
                              return (
                              <>
                                  <div className='order-book'>
                                      <div className='book-content'>
                                          <img src= {`${import.meta.env.VITE_BACKEND_URL}/images/book/${book.detail.thumbnail}`} />
                                          <div className='title'>
                                              {book?.detail?.mainText}
                                          </div>
                                          <div className='price'>
                                              {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(currentBookPrice)}
                                          </div>
                                      </div>
                                      <div className='action'>
                                          <div className='quantity'>
                                            Số lượng: {book?.quantity}
                                          </div>
                                          <div className='sum'>
                                              Tổng:{new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(currentBookPrice * book?.quantity)}
                                          </div>
                                          <DeleteTwoTone
                                              style={{cursor: 'pointer'}}
                                              onClick={() => dispatch(doDeleteItemCartAction({_id: book._id}))}
                                              twoToneColor="#eb2f96"
                                          />
                                      </div>
                                  </div>
                              </>
                          )})
                      )}
                    
                  </Col>
                  <Col md={6} xs={24} >
                      <div className='order-sum' style={{width: "100%"}}>
                          <div className='calculate'>
                            <Form  onFinish={onFinish} form={form} name="validateOnly" layout="vertical" autoComplete="off">
                              <Form.Item name="fullName" initialValue={user?.fullName}  label="Tên người nhận" rules={[{ required: true }]}>
                                <Input style={{width:"18.75rem"}} />
                              </Form.Item>
                              <Form.Item name="phone" initialValue={user?.phone} label="Số điện thoại" rules={[{ required: true }]}>
                                <Input style={{width:"18.75rem"}} />
                              </Form.Item>
                              <Form.Item label="Địa chỉ"  name="address" rules={[{ required: true }]}>
                                <TextArea rows={5}/>
                              </Form.Item>
                            </Form>
                          </div>
                          <Divider style={{ margin: "10px 0" }} />
                          <div className='calculate'>
                              <span>Tổng tiền</span>
                              <span className='sum-final'>
                              {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(totalPrice || 0)}
                              </span>
                          </div>
                          <Divider style={{ margin: "10px 0" }} />
                          <button onClick={() => form.submit()} disabled={isSubmit}> 
                            {isSubmit && <span><LoadingOutlined/>&nbsp;</span>} 
                            Đặt Hàng  ({carts?.length ?? 0})
                          </button>
                      </div>
                  </Col>
              </Row>
          </div>)
        }
        {carts.length !== 0 && (<Empty/>)}      
      </div>
   )            
}

export default Payment;