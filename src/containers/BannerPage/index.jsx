import React, { useEffect, useState } from 'react';
import { message, Spin, Divider, Radio, Input, Button } from 'antd';
import bannersApi from 'api/bannersApi';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './BannerPage.module.scss';
import BannerForm from 'components/BannerForm';

const BannerPage = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [banner, setBanner] = useState({});
  const [total, setTotal] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      const id = pathname?.split('/')[2];

      await fetchTotal();

      if (!id || id === 'create') {
        setBanner({});
        setLoading(false);
        return;
      }

      const response = await bannersApi.getBanner(id);

      setBanner(response.data);
    } catch (error) {
      message.error('Error on get banner');
    } finally {
      setLoading(false);
    }
  };

  const fetchTotal = async () => {
    try {
      const response = await bannersApi.getBanners({
        page: 1,
        size: 1,
        isPublished: [true, false],
      });
      setTotal(response.headers['x-total-count']);
    } catch (e) {
      message.error('Error on get number of banners');
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      let response;

      if (banner.id) {
        response = await bannersApi.updateBanner(banner.id, values);
      } else {
        response = await bannersApi.createBanner(values);
      }

      setBanner(response.data);
      message.success(`Banner has been ${banner.id ? 'updated' : 'created'}`);
    } catch (e) {
      message.error(`Error on ${banner.id ? 'update' : 'create'} banner`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  useEffect(() => {
    fetchBanner();
  }, [pathname]);

  return isLoading ? (
    <Spin className={styles.spin} />
  ) : (
    <div className={styles.banner}>
      <div className={styles.header}>
        <h1>{banner.id ? 'Update Banner' : 'Create Banner'}</h1>
        {banner?.type === 'LIST' && (
          <Button
            type="primary"
            onClick={() => navigate(`/banners/${banner.id}/items`)}
          >
            Show Items
          </Button>
        )}
      </div>
      <BannerForm banner={banner} total={total} onFinish={onFinish} />
    </div>
  );
};

export default BannerPage;
