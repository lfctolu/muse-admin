import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { MENU_ITEMS } from './utils';
import styles from './Sidebar.module.scss';

function Sidebar() {
  const { pathname } = useLocation();
  const [selectedKey, setSelectedKey] = useState();

  useEffect(() => {
    setSelectedKey(MENU_ITEMS.find((item) => item.href === pathname)?.key);
  }, [pathname]);

  return (
    <Menu
      mode="inline"
      theme="dark"
      className={styles.menu}
      selectedKeys={[selectedKey]}
    >
      {MENU_ITEMS.map((item) => (
        <Menu.Item key={item.key} icon={item.icon}>
          <Link to={item.href}>{item.name}</Link>
        </Menu.Item>
      ))}
    </Menu>
  );
}

export default Sidebar;
