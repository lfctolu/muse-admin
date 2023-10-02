import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Table, message, Modal, Input } from 'antd';
import profilesApi from 'api/profilesApi';
import { getColumns } from './utils';
import styles from './UserList.module.scss';
import debounce from 'lodash/debounce';

const SEARCH_DELAY = 500;

const UserListPage = () => {
  const [userList, setUserList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useSearchParams({ page: 1, size: 20, query: '' });

  const fetchUserList = async () => {
    try {
      setLoading(true);

      const response = await profilesApi.searchProfiles(
        Object.fromEntries(params)
      );

      setUserList(response.data);
      setTotal(response.headers['x-total-count']);
    } catch (error) {
      message.error('Error on get profile list');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async ({ id, username }) => {
    Modal.confirm({
      title: `Do you really want to delete ${username}?`,
      content: 'This action cannot be undone',
      centered: true,
      maskClosable: true,
      onOk: async () => {
        try {
          setLoading(true);
          await profilesApi.deleteProfile(id);
          await fetchUserList();
        } catch (err) {
          message.error(`Error on deletion user ${username}`);
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
    fetchUserList();
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  useEffect(() => {
    fetchUserList();
  }, [params]);

  return (
    <div>
      <h2>User List</h2>
      <div>
        <Input.Search
          className={styles.search}
          placeholder="Search"
          defaultValue={params.get('query')}
          onChange={debouncedSearch}
          allowClear
        />
        <Table
          columns={getColumns(deleteUser)}
          dataSource={userList}
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

// Export the component as a default or a named export
export default UserListPage;
