import { Modal, notification } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { Button, Table } from 'antd';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { callBulkCreateUser } from '../../../../services/api';
import templateFile from './template.xlsx?url';

const { Dragger } = Upload;
const UserImport = (props) => {
  const { openModalImport , setOpenModalImport} = props;
  const handleOk = () => {
    setOpenModalImport(false);
  };

  const handleCancel = () => {
    setOpenModalImport(false);
  };

  const [dataExcel, setDataExcel] = useState([])

  const columns = [
    {
      title: 'Tên hiển thị',
      dataIndex: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
    },
  ];

  
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };

  const propsUpload = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    //https://stackoverflow.com/questions/11832930/html-input-file-accept-attribute-file-type-csv
    accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",


    //https://stackoverflow.com/questions/51514757/action-function-is-required-with-antd-upload-control-but-i-dont-need-it
    // action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    customRequest: dummyRequest,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        if(info.fileList && info.fileList.length > 0){
          const file = info.fileList[0].originFileObj;
          const reader = new FileReader();
          reader.readAsArrayBuffer(file)        
          reader.onload = function(e) {
            const data = new Uint8Array(reader.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            // convert to json format
            const json = XLSX.utils.sheet_to_json(sheet, {
              header: ["fullName", "email", "phone"],
              range: 1 //skip rows header
            });
            console.log("check json", json);
            if(json && json.length > 0) setDataExcel(json)
        };
        }

        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleSubmit = async() => {
    const data = dataExcel.map(item => {
      item.password = '123456';
      return item;
    })
    const res = await callBulkCreateUser(data);
    if(res.data) {
      notification.success(
        {
          description: `Success: ${res.data.countSuccess}, Error : ${res.data.countError}`,
          message: "Upload thành công",
        }
      )
      setDataExcel([]);
      setOpenModalImport(false); 
      props.fetchUser();
    }else {
      notification.error({
        description: res.message,
        message: "Đã có lỗi xảy ra",
      })
    }
  }


  return (
    <>
     <Modal title="Basic Modal" 
      open={openModalImport} 
      okText ="Import data"
      onOk={() => handleSubmit()}
      onCancel={() => {
        setOpenModalImport(false);
        setDataExcel([])
      }}
      okButtonProps={{
        disabled: dataExcel.length < 1
      }}

      //do not close when click outside
      maskClosable={false}
    >
      <Dragger
      {...propsUpload}
     
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single upload. Only accept .cvs, .xls, .xlsx
        </p>
        &nbsp; <a 
        onClick={e => e.stopPropagation()} 
        href={templateFile} 
        download>Download Sample File</a>
      </Dragger>   
      <Table dataSource={dataExcel} title={() => <span>Dữ liệu upload</span>} columns={columns}/>
    </Modal>
    </>
  )
}

export default UserImport