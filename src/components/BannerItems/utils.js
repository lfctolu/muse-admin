import { Button, Image, InputNumber } from 'antd';
import React from 'react';
import styles from './BannerItems.module.scss';

const getColumns = ({
  buttonAction,
  showPosition = false,
  onPositionChange,
  total = 0,
}) => {
  const columns = [];

  if (showPosition) {
    columns.push({
      title: 'Position',
      key: 'position',
      dataIndex: 'position',
      render: (position, item) => (
        <InputNumber
          min={0}
          max={total}
          value={position}
          onChange={(p) => onPositionChange(item.id, p)}
        />
      ),
    });
  }

  columns.push(
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
        <Button
          danger={buttonAction.isDelete}
          onClick={() => buttonAction.action(item)}
        >
          {buttonAction.text}
        </Button>
      ),
    }
  );

  return columns;
};

export { getColumns };
