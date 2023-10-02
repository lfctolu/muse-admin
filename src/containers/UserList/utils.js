import { Button } from 'antd';
import React from 'react';

const getColumns = (deleteAction) => [
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => `${record.name} ${record.lastName || ''}`,
  },
  {
    title: 'Action',
    key: 'action',
    render: (user) => (
      <Button type="primary" danger onClick={() => deleteAction(user)}>
        Delete
      </Button>
    ),
  },
];

export { getColumns };
