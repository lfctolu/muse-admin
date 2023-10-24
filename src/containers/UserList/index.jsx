import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Table, message, Modal, Input, Button } from 'antd';
import profilesApi from 'api/profilesApi';
import { getColumns } from './utils';
import styles from './UserList.module.scss';
import debounce from 'lodash/debounce';
import { DownloadOutlined } from '@ant-design/icons';

const SEARCH_DELAY = 500;

const UserListPage = () => {
  const [userList, setUserList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useSearchParams({ page: 1, size: 20, query: '' });
  const [isDownload, setDownload] = useState(false);

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

  const downloadCsv = async () => {
    try {
      setDownload(true);
      const csv = await profilesApi.generateCsv();
      const url = URL.createObjectURL(csv.data);

      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'profiles.csv';

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (e) {
      message.error('Error on downloading csv');
    } finally {
      setDownload(false);
    }
  };

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
      <div className={styles.header}>
        <h2>Users</h2>
        <Button
          onClick={downloadCsv}
          icon={<DownloadOutlined />}
          type="primary"
          loading={isDownload}
        >
          Download CSV
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
