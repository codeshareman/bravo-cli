import React, { FC } from 'react';
import styled from 'styled-components';
import Navigation from './Navigation';

const Layer: FC = (props) => {
  return (
    <Container>
      <Navigation />
      <div className="main-content">{props.children}</div>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  min-height: 600px;
  background: rgba(246, 249, 252, 1);
  display: flex;
  position: relative;
  > .main-content {
    flex: 1;
    overflow: auto;
    margin: 26px 20px 26px 240px;
    padding: 24px;
    background: #fff;
    overflow: auto;
    > .main {
      height: 100%;
    }
  }
`;

export default Layer;
