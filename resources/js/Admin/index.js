import React from "react";
import { render } from 'react-dom';
import { Provider } from "react-redux";
import AdminRoutes from './src/routes';
import store from './src/redux';
import './src/scss/index.scss';
import { BrowserRouter} from "react-router-dom";

const container = document.getElementById('root');
render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={store}>
      <AdminRoutes />
    </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  container
);
