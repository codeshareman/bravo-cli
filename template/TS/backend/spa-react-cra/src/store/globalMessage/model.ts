import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: []
};

export const modalName = 'globalMessage';
const model = createSlice({
  name: modalName,
  initialState,
  reducers: {
    addMessage(state, action) {},
    removeMessage() {}
  }
});

export type IGlobalState = typeof initialState;
export default model;
