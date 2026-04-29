import { FileTextOutlined, LoginOutlined, MoonOutlined, PlusOutlined, SunOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Space, Switch, Typography } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useThemeMode } from '../contexts/ThemeContext.jsx';

const { Header } = Layout;
const { Title } = Typography;

function AppHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, signOut, user } = useAuth();
  const { isDark, toggleTheme } = useThemeMode();

  const handleSignOut = () => {
    signOut();
    navigate('/login', { replace: true });
  };

  return (
    <Header className="app-header">
      <Space className="brand" size="middle">
        <FileTextOutlined className="brand-icon" />
        <Title level={3} className="brand-title">
          Smart Notes
        </Title>
      </Space>
      {isAuthenticated && (
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname.startsWith('/notes') ? 'notes' : 'home']}
          className="header-menu"
          items={[
            {
              key: 'notes',
              label: <Link to="/notes">Workspace</Link>,
            },
          ]}
        />
      )}
      <Space className="header-actions" wrap>
        <Switch
          checked={isDark}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          onChange={toggleTheme}
        />
        {isAuthenticated ? (
          <>
            <span className="user-pill">{user?.full_name}</span>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/notes/new')}>
              New note
            </Button>
            <Button icon={<LoginOutlined />} onClick={handleSignOut}>
              Logout
            </Button>
          </>
        ) : (
          <Button type="primary" onClick={() => navigate('/login')}>
            Sign in
          </Button>
        )}
      </Space>
    </Header>
  );
}

export default AppHeader;
