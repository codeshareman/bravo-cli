export type AsyncReply<T = never> = Promise<T>;

export type Reply<T> = {
  status: 'success' | 'error';
  data: T;
};

export type TPage = {
  offset: number;
  limit: number;
};
