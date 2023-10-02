import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Table, message, Modal, Input } from 'antd';
import itemsApi from 'api/itemsApi';
import { getColumns } from './utils';
import styles from './ProductList.module.scss';
import debounce from 'lodash/debounce';

const SEARCH_DELAY = 500;

const ProductListPage = () => {
  const [itemList, setItemList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useSearchParams({ page: 1, size: 20, query: '' });

  const fetchItemList = async () => {
    try {
      setLoading(true);

      const response = await itemsApi.searchItems(Object.fromEntries(params));

      setItemList(response.data);
      setTotal(response.headers['x-total-count']);
    } catch (error) {
      message.error('Error on get profile list');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async ({ id, name }) => {
    Modal.confirm({
      title: `Do you really want to delete ${name}?`,
      content: 'This action cannot be undone',
      centered: true,
      maskClosable: true,
      onOk: async () => {
        try {
          setLoading(true);
          await itemsApi.deleteItem(id);
          await fetchItemList();
        } catch (err) {
          message.error(`Error on deletion item ${name}`);
        } finally {
          setLoading(false);
        }
      },
      okText: 'DELETE',
      okButtonProps: {
        danger: true,
      },
    });
  };

  const debouncedSearch = debounce(async (event) => {
    params.set('query', event.target.value);
    setParams(params);
  }, SEARCH_DELAY);

  useEffect(() => {
    fetchItemList();
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  useEffect(() => {
    fetchItemList();
  }, [params]);

  return (
    <div>
      <h2>Product List</h2>
      <div>
        <Input.Search
          className={styles.search}
          placeholder="Search"
          defaultValue={params.get('query')}
          onChange={debouncedSearch}
          allowClear
        />
        <Table
          columns={getColumns(deleteItem)}
          dataSource={itemList}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: Number(params.get('size')),
            current: Number(params.get('page')),
            total: total,
            onChange: (page, size) => {
              params.set('page', page);
              params.set('size', size);
              setParams(params);
            },
          }}
        />
      </div>
    </div>
  );
};

export default ProductListPage;
