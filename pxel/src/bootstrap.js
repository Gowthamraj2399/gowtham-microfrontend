import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import { createMemoryHistory, createBrowserHistory } from 'history';

const queryClient = new QueryClient({});

// Mount function to start up the app
const mount = (el, { onNavigate, defaultHistory, initialPath }) => {
  const history =
    defaultHistory ||
    createMemoryHistory({
      initialEntries: [initialPath || '/'],
    });

  if (onNavigate) {
    history.listen((update) => {
      onNavigate({ pathname: update.location.pathname });
    });
  }

  const root = createRoot(el);
  root.render(
    <QueryClientProvider client={queryClient}>
      <App history={history} />
    </QueryClientProvider>
  );

  return {
    onParentNavigate({ pathname: nextPathname }) {
      const { pathname } = history.location;

      if (pathname !== nextPathname) {
        history.push(nextPathname);
      }
    },
  };
};

// If we are in development and in isolation,
// call mount immediately
if (process.env.NODE_ENV === 'development') {
  const devRoot = document.querySelector('#_marketing-dev-root');

  if (devRoot) {
    mount(devRoot, { 
      defaultHistory: createBrowserHistory(),
      initialPath: '/pxel/'
    });
  }
}

// We are running through container
// and we should export the mount function
export { mount };
