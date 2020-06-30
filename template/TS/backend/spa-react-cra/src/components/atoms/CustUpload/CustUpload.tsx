import React, { FC } from 'react';
import styled from 'styled-components';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadProps } from 'antd/lib/upload';
import { RcCustomRequestOptions, UploadFile } from 'antd/lib/upload/interface';
import { EUploadFileCate, TUploadStatus } from './types';

type IExtra = {
  btnTxt?: string;
  limitSize?: number;
};
type CustUploadProps = UploadProps & {
  cate: EUploadFileCate;
  extra?: IExtra;
  onSetFileList: (cate: EUploadFileCate, config: any, status?: TUploadStatus) => void;
  fileList: Array<UploadFile>;
};

const CustUpload: FC<CustUploadProps> = ({ cate, extra, ...rest }) => {
  const UploadProps: UploadProps = {
    accept: rest.accept || '*',
    multiple: false,
    headers: {
      Authorization: '',
    },
    fileList: rest.fileList || [],

    onRemove: () => {
      rest.onSetFileList && rest.onSetFileList(cate, []);
    },

    beforeUpload: (file, fileList) => {
      const canUpload =
        (extra && extra.limitSize && file.size <= extra.limitSize) || !extra?.limitSize;
      if (!canUpload) {
        message.error('上传文件超出大小限制');
      }
      canUpload && rest.onSetFileList(cate, fileList, 'uploading');
      return canUpload;
    },

    customRequest: function ({ file, onError, onProgress, onSuccess }: RcCustomRequestOptions) {},
  };

  return (
    <Container>
      <Upload {...UploadProps}>
        <Button>
          <UploadOutlined /> {extra?.btnTxt || '上传文件'}
        </Button>
      </Upload>
    </Container>
  );
};

const Container = styled.div``;

export default CustUpload;
