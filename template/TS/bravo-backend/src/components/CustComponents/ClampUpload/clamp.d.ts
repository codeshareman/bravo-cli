export type TokenParams = {
  filename: string;
  fileSize: number;
  uploadType: string;
};

export type PostMkfileParams = {
  uploadType: string;
  fileSize: number;
  ext: string;
  token: string;
  serverIp: string;
  ctx: string;
};

export type PostMkblkParmas = {
  token: string;
  file: Blob;
  onProgress?(percent: any, file: Blob);
};

export type TerminalParams = {
  filename: string;
  uid: string;
  fileSize: number;
  fileUrl: string;
  callbackData?();
};
