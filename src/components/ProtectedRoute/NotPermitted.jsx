import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const NotPermitted = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="403"
      title="403"
      subIitle="Sorry, you are not authorized to access this page."
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          Go Console
        </Button>
      }
    />
  );
};
export default NotPermitted;
