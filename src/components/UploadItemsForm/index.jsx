import React from 'react';
import { Form, Select, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styles from './UploadItemsForm.module.scss';

const UploadItemsForm = ({ categories, isLoading, onFinish }) => {
  return (
    <Form
      name="uploadItemsForm"
      className={styles.form}
      labelCol={{ span: 5 }}
      onFinish={onFinish}
    >
      <Form.Item
        name="category"
        rules={[
          {
            required: true,
            message: 'Please select a category',
          },
        ]}
      >
        <Select placeholder="Category">
          {categories.map((category) => (
            <Select.Option key={category.id} value={category.id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        className={styles.imageUpload}
        name="file"
        rules={[
          {
            required: true,
            validator: (rule, value) => {
              if (!value?.fileList || !value.fileList.length) {
                return Promise.reject('File is required');
              }

              return Promise.resolve();
            },
          },
        ]}
      >
        <Upload
          accept="text/csv"
          listType="picture-card"
          maxCount={1}
          beforeUpload={() => false}
        >
          <div>
            <UploadOutlined />
            <div>CSV</div>
          </div>
        </Upload>
      </Form.Item>
      <Form.Item className={styles.buttonItem}>
        <Button
          className={styles.button}
          type="primary"
          htmlType="submit"
          loading={isLoading}
        >
          Upload
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UploadItemsForm;
