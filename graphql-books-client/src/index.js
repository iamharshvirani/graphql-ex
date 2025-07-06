import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';

import { ThemeProvider } from './context/ThemeContext';

const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </ApolloProvider>
);
