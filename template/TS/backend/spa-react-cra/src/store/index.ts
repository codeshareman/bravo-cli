import { createStore } from 'redux-dynamic-modules';
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import { globalMessageModule } from './globalMessage';

const store = createStore(
  {
    initialState: {
      /** initial state */
    },
    enhancers: [
      /** enhancers to include */
    ],
    extensions: [
      {
        middleware: getDefaultMiddleware()
      }
      /** extensions to include i.e. getSagaExtension(), getThunkExtension() */
    ]
  },
  /* ...any additional modules */
  globalMessageModule
);
export default store;
