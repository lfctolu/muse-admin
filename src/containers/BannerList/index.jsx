import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Table, message, Modal, Button } from 'antd';
import bannersApi from 'api/bannersApi';
import { getColumns } from './utils';
import styles from './BannerList.module.scss';

const BannerListPage = () => {
  const [banners, setBanners] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useSearchParams({
    page: 1,
    size: 20,
    isPublished: 'true,false',
  });
  const navigate = useNavigate();

  const fetchBanners = async () => {
    try {
      setLoading(true);

      const response = await bannersApi.getBanners({
        ...Object.fromEntries(params),
        isPublished: [true, false],
      });

      setBanners(response.data);
      setTotal(response.headers['x-total-count']);
    } catch (error) {
      message.error('Error on getting banners');
    } finally {
      setLoading(false);
    }
  };

  const createBanner = async () => {
    navigate('/banners/create');
  };

  const deleteBanner = async ({ id, name }) => {
    Modal.confirm({
      title: `Do you really want to delete ${name}?`,
      content: 'This action cannot be undone',
      centered: true,
      maskClosable: true,
      onOk: async () => {
        try {
          setLoading(true);
          await bannersApi.deleteBanner(id);
          await fetchBanners();
        } catch (err) {
          message.error(`Error on deletion banner ${name}`);
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

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [params]);

  return (
    <div>
      <div className={styles.header}>
        <h2>Banners</h2>
        <Button onClick={createBanner} type="primary">
          Create Banner
        </Button>
      </div>
      <div>
        <Table
          columns={getColumns(deleteBanner)}
          dataSource={banners}
          rowKey="id"
          onRow={(row) => ({ onClick: () => navigate(`/banners/${row.id}`) })}
          rowClassName={styles.row}
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

export default BannerListPage;
