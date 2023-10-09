import { Button, Checkbox, Image, Tag } from 'antd';
import React from 'react';
import styles from './BannerList.module.scss';

const getColumns = (deleteAction) => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (name, item) =>
      item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          {name}
        </a>
      ) : (
        name
      ),
  },
  {
    title: 'Image',
    dataIndex: 'imageUrl',
    key: 'image',
    render: (imageUrl) => (
      <div className={styles.imageWrapper} onClick={(e) => e.stopPropagation()}>
        <Image
          src={imageUrl}
          width={50}
          height={50}
          className={styles.image}
          placeholder
        />
      </div>
    ),
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Status',
    dataIndex: 'isPublished',
    key: 'status',
    render: (isPublished) => (
      <Tag color={isPublished ? 'green' : 'default'}>
        {isPublished ? 'Published' : 'Unpublished'}
      </Tag>
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
