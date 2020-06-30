import { RcFile } from 'antd/lib/upload';

export enum EUploadFileCate {
  CONFIG,
  ATTACH,
}

export type TUploadStatus = 'done' | 'uploading' | 'error' | undefined;

export type TSetFileListConfig = RcFile & { status?: TUploadStatus };
