import { Button, Result, Steps } from 'antd';
import { useState } from 'react';
import './order.scss';
import ViewOrder from '../../components/Order/ViewOrder';
import Payment from '../../components/Order/Payment';
import { SmileOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const Order = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  return (
    <>
      <div style={{backgroundColor:"#efefef", padding:"20px 0"}}>
        <div className='order-container' style={{maxWidth: 1440, margin: "0 auto"}}>
          <div className='order-steps'>
              <Steps
                style={{
                  backgroundColor:'white',
                  padding: "20px"
                }}
                size="small"
                current={currentStep}
                items={[
                  {
                    title: 'Đơn hàng',
                  },
                  {
                    title: 'Đặt hàng',
                  },
                  {
                    title: 'Thanh toán',
                  },
              ]}             
            />
          </div>
          {currentStep === 0 && (<ViewOrder setCurrentStep={setCurrentStep}/>  )}
          {currentStep === 1 &&  (<Payment setCurrentStep={setCurrentStep}/> )}
          {currentStep === 2
          && (<Result
                icon={<SmileOutlined/>}
                title="Đơn hàng dã được cập nhật thành công"
                extra={<Button type="primary" onClick={()=> navigate('/history')}>Xem lịch sử</Button>}                  
          /> )}
        </div>
      </div>
      
    </>
  )
}

export default Order