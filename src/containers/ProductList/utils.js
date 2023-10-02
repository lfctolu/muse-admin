import { Button, Image } from 'antd';
import React from 'react';
import styles from './ProductList.module.scss';

const getColumns = (deleteAction) => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (name, item) => (
      <a href={item.url} target="_blank" rel="noopener noreferrer">
        {name}
      </a>
    ),
  },
  {
    title: 'Image',
    dataIndex: 'imageUrls',
    key: 'image',
    render: (imageUrls) => (
      <Image.PreviewGroup items={imageUrls}>
        <Image
          src={imageUrls[0]}
          width={50}
          height={50}
          className={styles.image}
          placeholder
        />
      </Image.PreviewGroup>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (item) => (
      <Button type="primary" danger onClick={() => deleteAction(item)}>
        Delete
      </Button>
    ),
  },
];

export { getColumns };
