import React, { useState } from 'react';
import Login from './components/Login';
import TrapZoneController from './components/TrapZoneController';
import KiteService from './services/KiteService';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #1e222d;
  color: #fff;
`;

const Header = styled.header`
  background-color: #2a2e39;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LogoutButton = styled.button`
  background-color: #ff4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #cc0000;
  }
`;

const MainContent = styled.main`
  padding: 2rem;
  height: calc(100vh - 64px); /* Subtract header height */
`;

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = async (credentials) => {
    try {
      const response = await KiteService.login(credentials);
      setUser(response.user);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <AppContainer>
      <Header>
        <Title>2PC ALGO Trading Platform</Title>
        <UserInfo>
          <span>Welcome, {user.name}</span>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </UserInfo>
      </Header>
      <MainContent>
        <TrapZoneController />
      </MainContent>
    </AppContainer>
  );
}

export default App; 