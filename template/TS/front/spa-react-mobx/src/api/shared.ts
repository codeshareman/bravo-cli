export const basePath = "/cooperation-bank/";

export type Id = string | number;

export type Result<T> = T extends never ? {} : { data: T };

export type Reply<T = never> = Result<T> & {
  code: number;
  message: string;
};

export type AsyncReply<T = any> = Promise<Reply<T>>;

export type Page<T = any> = {
  current: number;
  total: number;
  data: T[];
};
