// pages/CustomOrderPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as antd from 'antd';

const CustomOrderPage = () => {
  const [form] = antd.Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async (values) => {
    setSubmitting(true);
    try {
      // Здесь будет реальный API-запрос
      await new Promise(resolve => setTimeout(resolve, 1000));
      antd.message.success('Заказ успешно отправлен!');
      form.resetFields();
    } catch (error) {
      antd.message.error('Не удалось отправить заказ. Попробуйте позже.');
    } finally {
      setSubmitting(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="custom-order-page"
    >
      <h1>Оформить кастомный заказ</h1>
      <antd.Form
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        style={{ maxWidth: '400px' }}
      >
        <antd.Form.Item
          label="Выберите размер"
          name="size"
          rules={[{ required: true, message: 'Пожалуйста, укажите размер' }]}
        >
          <antd.Select placeholder="— выберите —">
            <antd.Select.Option value="S">S</antd.Select.Option>
            <antd.Select.Option value="M">M</antd.Select.Option>
            <antd.Select.Option value="L">L</antd.Select.Option>
            <antd.Select.Option value="XL">XL</antd.Select.Option>
          </antd.Select>
        </antd.Form.Item>

        <antd.Form.Item
          label="Выберите цвет"
          name="color"
          rules={[{ required: true, message: 'Пожалуйста, укажите цвет' }]}
        >
          <antd.Input placeholder="Например, чёрный" />
        </antd.Form.Item>

        <antd.Form.Item label="Примечания" name="notes">
          <antd.Input.TextArea rows={4} placeholder="Дополнительные пожелания..." />
        </antd.Form.Item>

        <antd.Form.Item>
          <antd.Button 
            type="primary" 
            htmlType="submit"
            loading={submitting}
          >
            Отправить заказ
          </antd.Button>
        </antd.Form.Item>
      </antd.Form>
    </motion.div>
  );
};

export default CustomOrderPage; 