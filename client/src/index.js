import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { PostsContextProvider } from './context/PostContext';
import { ActiveUserContextProvider } from './context/activeUserContext';
import { UsersContextProvider } from './context/UserContext';
import { SearchResultContextProvider } from './context/SearchResultContext';
import { CommentsContextProvider } from './context/CommentContext';
import store from './store/rootReducer';
import { Provider } from 'react-redux';
import { BasketContextProvider, BasketProvider } from './context/BasketContext';
import { OrderContextProvider } from './context/OrderContext';
import { ProductCountProvider } from './context/ProductCountContext';
import { AdminContextProvider } from './context/AdminContext';
import { UserPostsContextProvider } from './context/UserPostsContext';
import { FavContextProvider } from './context/FavContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <PostsContextProvider>
      <UserPostsContextProvider>
      <ActiveUserContextProvider>
        <AdminContextProvider>
        <UsersContextProvider>
          <SearchResultContextProvider>
            <CommentsContextProvider>
            <ProductCountProvider>
              <OrderContextProvider>
            <BasketContextProvider>
              <FavContextProvider>
              <Provider store={store}>
               <App />
              </Provider>
              </FavContextProvider>
              </BasketContextProvider>
              </OrderContextProvider>
              </ProductCountProvider>
            </CommentsContextProvider>
          </SearchResultContextProvider>
        </UsersContextProvider>
        </AdminContextProvider>
      </ActiveUserContextProvider>
      </UserPostsContextProvider>
    </PostsContextProvider>
  </BrowserRouter>
);
