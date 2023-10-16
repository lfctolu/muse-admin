import React from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Checkbox,
  Upload,
  message,
  Modal,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import imagesApi from 'api/imagesApi';
import styles from './BannerForm.module.scss';

const IMAGE_SIZE = 20 * 1024 * 1024;

const BannerForm = ({ banner, total, onFinish }) => {
  const beforeUpload = async (file) => {
    if (IMAGE_SIZE < file.size) {
      message.error('Image must be smaller than 20MB!');
    }
  };

  const customRequest = async ({ onSuccess, onError, file }) => {
    const image = await imagesApi.generateImageUrl();

    try {
      await imagesApi.upload(image.data.uploadUrl, file);
      onSuccess(image.data.url);
    } catch (err) {
      onError(err);
      message.error('Image upload failed');
    }
  };

  const handlePreview = async (file) => {
    console.log(file);
    Modal.info({
      title: file.name,
      content: (
        <img className={styles.imagePreview} src={file.url || file.response} />
      ),
      footer: null,
      icon: null,
      centered: true,
      maskClosable: true,
      width: 'auto',
      height: 'auto',
    });
  };

  const onFormSubmit = async (values) => {
    onFinish({
      ...values,
      imageUrl: values.imageUrl?.file?.response,
      url: values.url || undefined,
    });
  };

  return (
    <Form
      name="bannerForm"
      className={styles.form}
      labelCol={{ span: 5 }}
      onFinish={onFormSubmit}
    >
      <Form.Item
        className={styles.imageUpload}
        name="imageUrl"
        rules={[
          {
            required: true,
            validator: (rule, value) => {
              console.log(value);
              if (!value.file || value.file.status === 'removed') {
                return Promise.reject('Image is required');
              }

              return Promise.resolve();
            },
          },
        ]}
      >
        <Upload
          accept="image/*"
          listType="picture-card"
          maxCount={1}
          customRequest={customRequest}
          beforeUpload={beforeUpload}
          onPreview={handlePreview}
          defaultFileList={
            banner.imageUrl ? [{ url: banner.imageUrl }] : undefined
          }
        >
          <div>
            <UploadOutlined />
            <div>Image</div>
          </div>
        </Upload>
      </Form.Item>
      <Form.Item
        label="Name"
        className={styles.inputItem}
        name="name"
        initialValue={banner.name}
        rules={[
          {
            required: true,
            message: 'Please enter banner name',
          },
        ]}
      >
        <Input placeholder="Name" autoComplete="Name" />
      </Form.Item>
      <Form.Item
        label="Position"
        className={styles.inputItem}
        name="position"
        initialValue={banner.position || 0}
        rules={[
          { required: true, message: 'Please set position' },
          {
            type: 'number',
            min: 0,
            max: total,
            message: 'Position must be in range',
          },
        ]}
      >
        <InputNumber min={0} max={total} />
      </Form.Item>
      <Form.Item
        label="Type"
        name="type"
        initialValue={banner.type}
        rules={[
          {
            required: true,
            message: 'Please select a type',
          },
        ]}
      >
        <Select placeholder="Type">
          <Select.Option value="LIST">LIST</Select.Option>
          <Select.Option value="LINK">LINK</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="URL"
        name="url"
        initialValue={banner.url}
        rules={[
          {
            type: 'url',
            message: 'URL must be  valid',
          },
          (formInstance) => ({
            validator: (rule, value) => {
              const type = formInstance.getFieldValue('type');
              if (type === 'LINK' && !value) {
                return Promise.reject(
                  new Error('URL is required for type LINK')
                );
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input placeholder="URL" />
      </Form.Item>
      <Form.Item
        label="Published"
        name="isPublished"
        valuePropName="checked"
        initialValue={banner.isPublished || false}
        rules={[
          {
            required: true,
            message: 'Select published',
          },
        ]}
      >
        <Checkbox />
      </Form.Item>
      <Form.Item className={styles.buttonItem}>
        <Button className={styles.button} type="primary" htmlType="submit">
          {banner.id ? 'Update' : 'Create'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BannerForm;
