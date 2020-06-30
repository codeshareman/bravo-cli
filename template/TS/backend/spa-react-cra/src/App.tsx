import React from 'react';
import Global from 'components/pages/Global';
import Router from './Router';
import { BrowserRouter } from 'react-router-dom';

const App: React.FC = () => {
  return (
      <BrowserRouter>
        <Global>
          <Router></Router>
        </Global>
      </BrowserRouter>
  );
};

export default App;
