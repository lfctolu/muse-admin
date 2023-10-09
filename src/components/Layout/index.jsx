import React, { useEffect, useState } from 'react';
import {
  Layout,
  Dropdown,
  Drawer,
  Menu,
  Avatar,
  Space,
  message,
  Spin,
} from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import Sidebar from 'components/Sidebar';
import { authAtom } from 'atoms';
import { useAtom } from 'jotai';
import accountApi from 'api/accountApi';

import styles from './Layout.module.scss';
import Cookies from 'js-cookie';
import { firebaseAuth } from 'api/firebaseClient';

const { Header, Sider, Content } = Layout;

function MainLayout(props) {
  const [auth, setAuth] = useAtom(authAtom);
  const [isLoading, setIsLoading] = useState(false);

  const getProfile = async () => {
    try {
      setIsLoading(true);
      const { data } = await accountApi.getProfile();

      setAuth((a) => ({ ...a, profile: data }));
    } catch (err) {
      message.error('Error on getting profile');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setAuth({ isLogged: false });
    Cookies.set('accessToken', null);
    await firebaseAuth.signOut();
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={logout}>
        Log out
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    getProfile();
  }, []);

  return isLoading ? (
    <Spin className={styles.spin} />
  ) : (
    <Layout>
      <Sider width={250} className={styles.sider}>
        <Sidebar />
      </Sider>
      <Layout className={styles.container}>
        <Header className={styles.header}>
          <p>Muse Admin Panel</p>
          <Dropdown overlay={menu} placement="bottom">
            <Space className={styles.profile}>
              <p className={styles.email}>{auth?.profile?.email}</p>
              <DownOutlined className={styles.arrow} />
            </Space>
          </Dropdown>
        </Header>
        <Content className={styles.content}>{props.children}</Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
