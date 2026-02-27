import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, Router } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles';
import { subscribeAuthToQueryClient } from './lib/auth-query';
import SignIn from './views/SignIn';
import Signup from './components/Signup';

const queryClient = new QueryClient();

function AuthSync() {
  useEffect(() => {
    return subscribeAuthToQueryClient(queryClient);
  }, []);
  return null;
}

export default ({ history }) => {
  const [location, setLocation] = useState(history.location);

  useEffect(() => {
    const unlisten = history.listen((update) => {
      setLocation(update.location);
    });
    return unlisten;
  }, [history]);

  return (
    <QueryClientProvider client={queryClient}>
      <StyledEngineProvider injectFirst>
        <AuthSync />
        <Router location={location} navigator={history}>
          <Routes>
            <Route path="/auth/signin" element={<SignIn history={history} />} />
            <Route path="/auth/signup" element={<Signup onSignIn={() => {}} />} />
          </Routes>
        </Router>
      </StyledEngineProvider>
    </QueryClientProvider>
  );
};
