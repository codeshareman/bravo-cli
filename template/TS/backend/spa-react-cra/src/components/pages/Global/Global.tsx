import React from 'react';
import { Normalize } from 'styled-normalize';
import GlobalStyle from './GlobalStyle';

const Layout = "div"

const Global: React.FC = ({ children }) => {
  return (
    <>
      <Normalize></Normalize>
      <GlobalStyle></GlobalStyle>
      <Layout>{children}</Layout>
    </>
  );
};

export default Global;
