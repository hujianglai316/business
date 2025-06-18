import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const { Content } = Layout;

const AuthContainer = styled(Layout)`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AuthContent = styled(Content)`
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  padding: 24px;
`;

const AuthLayout: React.FC = () => {
  return (
    <AuthContainer>
      <AuthContent>
        <Outlet />
      </AuthContent>
    </AuthContainer>
  );
};

export default AuthLayout; 