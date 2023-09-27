import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { authAtom } from 'atoms';
import { firebaseAuth } from 'api/firebaseClient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import styles from './LoginPage.module.scss';
import Cookies from 'js-cookie';
import accountApi from 'api/accountApi';

const LoginPage = () => {
  const setAuthAtom = useSetAtom(authAtom);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async ({ email, password }) => {
    try {
      setIsLoading(true);

      const {
        user: { accessToken },
      } = await signInWithEmailAndPassword(firebaseAuth, email, password);
      Cookies.set('accessToken', accessToken);

      setAuthAtom((auth) => ({ ...auth, isLogged: true }));
      navigate('/users');
    } catch (err) {
      if (err?.code === 'auth/user-not-found') {
        message.error('Incorrect email or password');
      } else {
        message.error('Error on login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.login}>
      <Form name="login" className={styles.form} onFinish={onFinish}>
        <h1 className={styles.header}>Login</h1>
        <Form.Item
          className={styles.inputItem}
          name="email"
          rules={[
            {
              required: true,
              type: 'email',
              message: 'Please input your email',
            },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Email"
            autoComplete="Email"
          />
        </Form.Item>
        <Form.Item
          className={styles.inputItem}
          name="password"
          rules={[{ required: true, message: 'Please input your password' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            autoComplete="current-password"
          />
        </Form.Item>
        <Form.Item className={styles.buttonItem}>
          <Button
            className={styles.button}
            loading={isLoading}
            type="primary"
            htmlType="submit"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
