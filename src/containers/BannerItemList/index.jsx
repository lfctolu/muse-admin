import React, { useEffect, useState } from 'react';
import { message, Spin, Divider, Radio, Input, Button, Modal } from 'antd';
import bannersApi from 'api/bannersApi';
import itemsApi from 'api/itemsApi';
import { useLocation } from 'react-router-dom';
import debounce from 'lodash/debounce';
import BannerItems from 'components/BannerItems';
import styles from './BannerItemList.module.scss';

const SEARCH_DELAY = 500;

const BannerPage = () => {
  const { pathname } = useLocation();
  const [total, setTotal] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState('items');
  const [params, setParams] = useState({
    page: 1,
    size: 20,
    query: '',
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      const id = pathname?.split('/')[2];
      let response;

      if (tab === 'items') {
        response = await bannersApi.getBannerItems(id, {
          ...params,
          query: undefined,
        });
        response.data = response.data.map((item, index) => ({
          ...item,
          position: (params.page - 1) * params.size + index,
        }));
      } else {
        response = await itemsApi.searchItems({ ...params, isCommon: true });
      }

      setItems(response.data);
      setTotal(response.headers['x-total-count']);
    } catch (error) {
      message.error('Error on get items');
    } finally {
      setLoading(false);
    }
  };

  const onTabChange = (event) => {
    setTab(event.target.value);
    setParams({
      page: 1,
      size: 20,
      query: '',
    });
  };

  const onTableChange = (page, size) => {
    setParams((p) => ({ ...p, page, size }));
  };

  const onPositionChange = async (itemId, position) => {
    try {
      setLoading(true);
      const id = pathname?.split('/')[2];
      await bannersApi.updateItemPosition(id, {
        itemId,
        position,
      });

      await fetchItems();
    } catch (error) {
      message.error('Error on update item position');
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce(async (event) => {
    setParams((p) => ({ ...p, query: event.target.value }));
  }, SEARCH_DELAY);

  const addItemAction = {
    text: 'Add',
    action: async (item) => {
      try {
        setLoading(true);
        const id = pathname?.split('/')[2];

        await bannersApi.addItemToBanner(id, {
          itemId: item.id,
          position: 0,
        });
        message.success(`Item has been added`);
      } catch (e) {
        message.error(`Error on add item`);
      } finally {
        setLoading(false);
      }
    },
  };

  const removeItemAction = {
    text: 'Delete',
    isDelete: true,
    action: async (item) => {
      Modal.confirm({
        title: `Remove item?`,
        content: item.name,
        centered: true,
        maskClosable: true,
        onOk: async () => {
          try {
            setLoading(true);
            const id = pathname?.split('/')[2];

            await bannersApi.removeItemFromBanner(id, item.id);
            const response = await bannersApi.getBannerItems(id, {
              ...params,
              query: undefined,
            });

            setItems(response.data);
            setTotal(response.headers['x-total-count']);
            message.success(`Item has been removed`);
          } catch (e) {
            message.error(`Error on remove item`);
          } finally {
            setLoading(false);
          }
        },
        okText: 'DELETE',
        okButtonProps: {
          danger: true,
        },
      });
    },
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [tab, params, pathname]);

  return (
    <div className={styles.banner}>
      <div className={styles.header}>
        <h1>Banner Items</h1>
      </div>

      <Divider>
        <Radio.Group className={styles.tabs} onChange={onTabChange} value={tab}>
          <Radio.Button value={'items'}>Items</Radio.Button>
          <Radio.Button value={'addNew'}>Add New</Radio.Button>
        </Radio.Group>
      </Divider>
      {tab === 'addNew' && (
        <Input.Search
          className={styles.search}
          placeholder="Search"
          defaultValue={params.query}
          onChange={debouncedSearch}
          allowClear
        />
      )}
      <BannerItems
        items={items}
        total={total}
        isLoading={isLoading}
        buttonAction={tab === 'items' ? removeItemAction : addItemAction}
        onChange={onTableChange}
        showPosition={tab === 'items'}
        onPositionChange={onPositionChange}
        page={params.page}
        size={params.size}
      />
    </div>
  );
};

export default BannerPage;
