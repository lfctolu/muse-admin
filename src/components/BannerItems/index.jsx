import React from 'react';
import { Table } from 'antd';
import { getColumns } from './utils';

const BannerItems = ({
  items,
  total,
  page,
  size,
  isLoading,
  buttonAction,
  onChange,
  showPosition,
  onPositionChange,
}) => {
  return (
    <Table
      columns={getColumns({
        buttonAction,
        total,
        showPosition,
        onPositionChange,
      })}
      dataSource={items}
      rowKey="id"
      loading={isLoading}
      showSizeChanger={true}
      pagination={{
        pageSize: size,
        current: page,
        total,
        onChange,
      }}
    />
  );
};

export default BannerItems;
