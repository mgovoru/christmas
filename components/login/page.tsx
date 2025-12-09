'use client';
import React from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const FormLogin: React.FC = () => (
  <Form
    name='basic'
    labelCol={{ span: 24 }}
    wrapperCol={{ span: 24 }}
    style={{ width: '40vw' }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete='off'
    layout='vertical'
  >
    <Form.Item<FieldType>
      label={
        <span
          style={{
            marginBottom: '6px',
            color: '#fff',
            fontWeight: '700',
            fontSize: '22px',
          }}
        >
          Кристина, введи логин
        </span>
      }
      name='username'
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item<FieldType>
      label={
        <span
          style={{
            marginBottom: '6px',
            color: '#fff',
            fontWeight: '700',
            fontSize: '22px',
            width: '100%',
          }}
        >
          Кристина, введи пароль
        </span>
      }
      name='password'
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password />
    </Form.Item>

    {/* <Form.Item<FieldType> name='remember' valuePropName='checked' label={null}>
      <Checkbox>Remember me</Checkbox>
    </Form.Item> */}

    <Form.Item label={null}>
      <Button
        type='primary'
        htmlType='submit'
        style={{
          color: '#fff',
          fontWeight: '700',
          fontSize: '20px',
					backgroundColor: 'red',
					height:'36px'
        }}
      >
        Нажимай, чтобы войти
      </Button>
    </Form.Item>
  </Form>
);

export default FormLogin;
