import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Space, Typography, message } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const { Paragraph, Title } = Typography;

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (values) => {
    try {
      await signIn(values);
      message.success('Welcome back.');
      navigate(location.state?.from?.pathname || '/notes', { replace: true });
    } catch (err) {
      message.error(err.response?.data?.detail || 'Invalid email or password.');
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <Space direction="vertical" size="large" className="page-stack">
          <div>
            <Title level={2}>Sign in</Title>
            <Paragraph>Access your private notes with a JWT-protected account.</Paragraph>
          </div>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
              <Input prefix={<MailOutlined />} placeholder="you@example.com" />
            </Form.Item>
            <Form.Item label="Password" name="password" rules={[{ required: true }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Your password" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Sign in
            </Button>
          </Form>
          <Paragraph className="auth-switch">
            No account yet? <Link to="/register">Create one</Link>
          </Paragraph>
        </Space>
      </Card>
    </div>
  );
}

export default LoginPage;
