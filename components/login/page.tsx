'use client';

import React, { useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Form, Input, message } from 'antd';
import { useRouter } from 'next/navigation';



type FieldType = {
  username?: string;
  password?: string;
};

const FormLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: values.username,
          pass: values.password,
        }),
      });

      if (res.ok) {
        message.success('Добро пожаловать, Кристина! 🎄');
        // Обновляем сессию и переходим на главную

         setTimeout(() => {
           // window.location.href = '/welcome';
           
           router.push('/welcome');
         }, 500);
      } else {
        message.error('Неверный логин или пароль 😢');
      }
    } catch (err) {
      message.error('Ошибка соединения');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name='basic'
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      style={{ width: '90vw', maxWidth: '400px' }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
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
        rules={[{ required: true, message: 'Пожалуйста, введи логин!' }]}
      >
        <Input size='large' />
      </Form.Item>

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
            Кристина, введи пароль
          </span>
        }
        name='password'
        rules={[{ required: true, message: 'Пожалуйста, введи пароль!' }]}
      >
        <Input.Password size='large' />
      </Form.Item>

      <Form.Item>
        <Button
          type='primary'
          htmlType='submit'
          loading={loading}
          style={{
            color: '#fff',
            fontWeight: '700',
            fontSize: '20px',
            backgroundColor: 'red',
            height: '48px',
            width: '100%',
          }}
        >
          Нажимай, чтобы войти
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormLogin;
