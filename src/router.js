import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ElementWrapper from 'components/ElementWrapper';
import LoginPage from './containers/LoginPage';
import UserListPage from './containers/UserList';
import ProductListPage from './containers/ProductList';
import BannerListPage from './containers/BannerList';
import BannerPage from './containers/BannerPage';
import BannerItemList from './containers/BannerItemList';

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
        />
        <Route
          path="/banners"
          element={<ElementWrapper component={BannerListPage} />}
        />
        <Route
          path="/banners/:id"
          element={<ElementWrapper component={BannerPage} />}
        />
        <Route
          path="/banners/:id/items"
          element={<ElementWrapper component={BannerItemList} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

// Export the component as a default or a named export
export default AppRouter;
