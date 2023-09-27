import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ElementWrapper from 'components/ElementWrapper';
import LoginPage from './containers/LoginPage';
import UserListPage from './containers/UserList';
import ProductListPage from './containers/ProductList';
//import BannerList from './components/BannerList';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/users"
          element={<ElementWrapper component={UserListPage} />}
        />
        <Route
          path="/products"
          element={<ElementWrapper component={ProductListPage} />}
        />{' '}
        {/* <Route path="/banners" component={BannerList} /> */}
      </Routes>
    </BrowserRouter>
  );
};

// Export the component as a default or a named export
export default AppRouter;
