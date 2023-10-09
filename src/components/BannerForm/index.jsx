import React from 'react';
import { Form, Input, InputNumber, Select, Button, Checkbox } from 'antd';

import styles from './BannerForm.module.scss';

const BannerForm = ({ banner, total, onFinish }) => {
  return (
    <Form
      name="bannerForm"
      className={styles.form}
      labelCol={{ span: 5 }}
      onFinish={onFinish}
    >
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
        label="Image URL"
        name="imageUrl"
        initialValue={banner.imageUrl}
        rules={[
          {
            required: true,
            message: 'Please enter an image URL',
          },
          {
            type: 'url',
            message: 'URL must be valid',
          },
        ]}
      >
        <Input placeholder="URL" />
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
