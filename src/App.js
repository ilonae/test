import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/styles/GlobalStyles';
import theme from 'src/styles';

import Dashboard from './views/Dashboard';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter>
        <Route path="/" exact component={() => Dashboard()} />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
