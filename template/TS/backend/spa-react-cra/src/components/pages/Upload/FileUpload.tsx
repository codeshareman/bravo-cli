import CustUpload from 'components/atoms/CustUpload';
import React, { FC, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Form, Button, message } from 'antd';
import { EUploadFileCate, TUploadStatus } from 'components/atoms/CustUpload/types';
import * as api from 'service';

const labelCols = {
  xs: 2,
  sm: 2,
  md: 2,
  lg: 2,
  xl: 2,
  xxl: 2,
};
const wrapperCols = {
  xs: 12,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 12,
  xxl: 12,
};

const FileUpload: FC = () => {
  const [loading, setLoading] = useState(false);
  const [confFileList, setConfFileList] = useState([]);
  const [attachFileList, setAttachFileList] = useState([]);

  const handleUploadFile = async () => {
    if (confFileList.length > 0 || attachFileList.length > 0) {
      setLoading(true);

      const formData = new FormData();
      confFileList[0] && formData.append('filename', confFileList[0]);
      attachFileList[0] && formData.append('attachment', attachFileList[0]);

      try {
        await api.config.uploadFile(formData);
        message.success('上传成功');
        confFileList[0] && setFileList(EUploadFileCate.CONFIG, confFileList, 'done');
        attachFileList[0] && setFileList(EUploadFileCate.ATTACH, attachFileList, 'done');
        setLoading(false);
      } catch (err) {
        confFileList[0] && setFileList(EUploadFileCate.CONFIG, confFileList, 'error');
        attachFileList[0] && setFileList(EUploadFileCate.ATTACH, attachFileList, 'error');
        setLoading(false);
      }
    }
  };

  const setFileList = useCallback((cate: EUploadFileCate, config: any, status: TUploadStatus) => {
    if (config) {
      if (config.length > 0) {
        config[0].status = status;
      }
      if (EUploadFileCate.CONFIG === cate) {
        setConfFileList(config);
      } else {
        setAttachFileList(config);
      }
    }
  }, []);

  return (
    <Conatiner>
      <h2>配置管理</h2>
      <Form
        labelAlign="left"
        labelCol={labelCols}
        wrapperCol={wrapperCols}
        onFinish={handleUploadFile}
      >
        <Form.Item name="filename" label="配置文件">
          <CustUpload
            accept=".yml"
            cate={EUploadFileCate.CONFIG}
            extra={{ btnTxt: '选择Job配置文件', limitSize: 40000 }}
            fileList={confFileList}
            onSetFileList={setFileList}
          />
        </Form.Item>
        <Form.Item name="attachment" label="附件">
          <CustUpload
            accept=".csv"
            cate={EUploadFileCate.ATTACH}
            extra={{ btnTxt: '选择数据文件' }}
            fileList={attachFileList}
            onSetFileList={setFileList}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            上传
          </Button>
        </Form.Item>
      </Form>
    </Conatiner>
  );
};

const Conatiner = styled.div`
  h2 {
    margin-bottom: 20px;
  }
`;

export default FileUpload;
