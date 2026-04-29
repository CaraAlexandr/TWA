import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Input, Row, Space, Statistic, Switch, Typography, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotesTable from '../components/NotesTable.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { deleteNote, getNotes, patchNote } from '../services/api.js';

const { Title, Paragraph } = Typography;

function NotesListPage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [includeArchived, setIncludeArchived] = useState(false);
  const { user } = useAuth();

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getNotes({
        search: search || undefined,
        include_archived: includeArchived,
      });
      setNotes(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not load notes.');
    } finally {
      setLoading(false);
    }
  }, [includeArchived, search]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      message.success('Note deleted successfully.');
      loadNotes();
    } catch (err) {
      message.error(err.response?.data?.detail || 'Could not delete note.');
    }
  };

  const handleTogglePin = async (note) => {
    try {
      await patchNote(note.id, { is_pinned: !note.is_pinned });
      message.success(note.is_pinned ? 'Note unpinned.' : 'Note pinned.');
      loadNotes();
    } catch (err) {
      message.error(err.response?.data?.detail || 'Could not update note.');
    }
  };

  const handleToggleArchive = async (note) => {
    try {
      await patchNote(note.id, { is_archived: !note.is_archived });
      message.success(note.is_archived ? 'Note restored.' : 'Note archived.');
      loadNotes();
    } catch (err) {
      message.error(err.response?.data?.detail || 'Could not update note.');
    }
  };

  return (
    <Space direction="vertical" size="large" className="page-stack">
      <Card className="hero-card">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} lg={14}>
            <Space direction="vertical" size="small">
              <span className="eyebrow">Private workspace</span>
              <Title level={1}>Welcome back, {user?.full_name?.split(' ')[0] || 'there'}.</Title>
              <Paragraph>
                A cleaner Smart Notes dashboard with protected notes, fast search, pinning and
                archive controls.
              </Paragraph>
              <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => navigate('/notes/new')}>
                Write a new note
              </Button>
            </Space>
          </Col>
          <Col xs={24} lg={10}>
            <div className="stats-grid">
              <Statistic title="Visible notes" value={notes.length} />
              <Statistic title="Pinned" value={notes.filter((note) => note.is_pinned).length} />
              <Statistic title="Archived" value={notes.filter((note) => note.is_archived).length} />
            </div>
          </Col>
        </Row>
      </Card>

      <Card className="content-card">
        <Space className="toolbar" wrap>
          <Input.Search
            prefix={<SearchOutlined />}
            allowClear
            placeholder="Search by title"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onSearch={loadNotes}
            className="search-input"
          />
          <Space>
            <span>Show archived</span>
            <Switch checked={includeArchived} onChange={setIncludeArchived} />
          </Space>
          <Button icon={<ReloadOutlined />} onClick={loadNotes}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/notes/new')}>
            Add Note
          </Button>
        </Space>

        {error && <Alert type="error" message={error} showIcon className="section-alert" />}

        <NotesTable
          notes={notes}
          loading={loading}
          onDelete={handleDelete}
          onTogglePin={handleTogglePin}
          onToggleArchive={handleToggleArchive}
        />
      </Card>
    </Space>
  );
}

export default NotesListPage;
