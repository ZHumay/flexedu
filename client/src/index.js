import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { ActiveUserContextProvider } from './context/activeUserContext';
import { UsersContextProvider } from './context/UserContext';
import store from './store/rootReducer';
import { Provider } from 'react-redux';

import { AdminContextProvider } from './context/AdminContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
   
      <ActiveUserContextProvider>
        <AdminContextProvider>
        <UsersContextProvider>
        
              <Provider store={store}>
               <App />
              </Provider>
      
        </UsersContextProvider>
        </AdminContextProvider>
      </ActiveUserContextProvider>
   
  </BrowserRouter>
);
