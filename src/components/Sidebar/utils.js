import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  FlagOutlined,
} from '@ant-design/icons';
import styles from './Sidebar.module.scss';

export const MENU_ITEMS = [
  {
    key: 'u',
    icon: <UserOutlined />,
    name: 'Users',
    href: '/users',
  },
  {
    key: 'p',
    icon: <ShoppingCartOutlined />,
    name: 'Products',
    href: '/products',
  },
  {
    key: 'b',
    icon: <FlagOutlined />,
    name: 'Banners',
    href: '/banners',
  },
];
