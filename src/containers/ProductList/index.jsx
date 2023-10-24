import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Table, message, Modal, Input, Button } from 'antd';
import itemsApi from 'api/itemsApi';
import categoriesApi from 'api/categoriesApi';
import { getColumns } from './utils';
import styles from './ProductList.module.scss';
import debounce from 'lodash/debounce';
import { UploadOutlined } from '@ant-design/icons';
import UploadItemsForm from 'components/UploadItemsForm';

const SEARCH_DELAY = 500;

const ProductListPage = () => {
  const [itemList, setItemList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useSearchParams({ page: 1, size: 20, query: '' });
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const fetchItemList = async () => {
    try {
      setLoading(true);

      const response = await itemsApi.searchItems(Object.fromEntries(params));

      setItemList(response.data);
      setTotal(response.headers['x-total-count']);
    } catch (error) {
      message.error('Error on get item list');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);

      const response = await categoriesApi.getCategories({
        page: 1,
        size: 100,
      });
      const count = response.headers['x-total-count'];
      const data = response.data;

      while (data.length < count) {
        data.push(
          ...(
            await categoriesApi.getCategories({
              page: 1,
              size: 100,
            })
          ).data
        );
      }

      setCategories(data);
    } catch (error) {
      message.error('Error on get item list');
    } finally {
      setCategoryLoading(false);
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

  const onItemsUpload = async ({ category, file }) => {
    try {
      setLoading(true);
      Modal.destroyAll();
      await itemsApi.uploadItems(category, file.file);
      message.success('Products have been uploaded');
    } catch (error) {
      message.error('Error on uploading products');
    }

    fetchItemList();
  };

  const showUploadModal = () =>
    Modal.info({
      icon: null,
      title: 'Upload products',
      content: (
        <UploadItemsForm
          categories={categories}
          onFinish={onItemsUpload}
          isLoading={loading}
        />
      ),
      closable: true,
      maskClosable: true,
      footer: null,
    });

  useEffect(() => {
    fetchItemList();
    fetchCategories();
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  useEffect(() => {
    fetchItemList();
  }, [params]);

  return (
    <div>
      <div className={styles.header}>
        <h2>Products</h2>
        <Button
          onClick={showUploadModal}
          icon={<UploadOutlined />}
          type="primary"
          loading={categoryLoading}
        >
          Upload CSV
        </Button>
      </div>
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
