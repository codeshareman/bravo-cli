import { Slice } from '@reduxjs/toolkit';

export const createDynamicModule = (model: Slice) => {
  const { name: id } = model;
  return {
    id,
    reducerMap: {
      [id]: model.reducer
    }
  };
};
