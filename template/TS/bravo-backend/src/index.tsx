// 库
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

function startApp() {
  const oscript = document.createElement('script');
  oscript.src = '//s1.xmcdn.com/yx/common-sdk/last/lib/city.js?v=1';
  document.head.appendChild(oscript);
  oscript.onload = function() {
    ReactDOM.render(<App />, document.getElementById('root-app'));
  };
}

startApp();
