import { FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Space, Typography } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Title } = Typography;

function AppHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Header className="app-header">
      <Space className="brand" size="middle">
        <FileTextOutlined className="brand-icon" />
        <Title level={3} className="brand-title">
          Smart Notes
        </Title>
      </Space>
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname.startsWith('/notes') ? 'notes' : 'home']}
        className="header-menu"
        items={[
          {
            key: 'notes',
            label: <Link to="/notes">Notes</Link>,
          },
        ]}
      />
      <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/notes/new')}>
        Add Note
      </Button>
    </Header>
  );
}

export default AppHeader;
