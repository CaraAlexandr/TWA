import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Space, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const { Paragraph, Title } = Typography;

function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      await signUp(values);
      message.success('Account created.');
      navigate('/notes', { replace: true });
    } catch (err) {
      message.error(err.response?.data?.detail || 'Could not create account.');
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <Space direction="vertical" size="large" className="page-stack">
          <div>
            <Title level={2}>Create account</Title>
            <Paragraph>Register once, then keep every note attached to your user.</Paragraph>
          </div>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Full name" name="full_name" rules={[{ required: true, min: 2 }]}>
              <Input prefix={<UserOutlined />} placeholder="Alex Popescu" />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
              <Input prefix={<MailOutlined />} placeholder="you@example.com" />
            </Form.Item>
            <Form.Item label="Password" name="password" rules={[{ required: true, min: 8 }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="At least 8 characters" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Create account
            </Button>
          </Form>
          <Paragraph className="auth-switch">
            Already registered? <Link to="/login">Sign in</Link>
          </Paragraph>
        </Space>
      </Card>
    </div>
  );
}

export default RegisterPage;
