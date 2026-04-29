import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Input, Space, Switch, Typography, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotesTable from '../components/NotesTable.jsx';
import { deleteNote, getNotes, patchNote } from '../services/api.js';

const { Title, Paragraph } = Typography;

function NotesListPage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [includeArchived, setIncludeArchived] = useState(false);

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
        <Space direction="vertical" size="small">
          <Title level={2}>Your notes, organized</Title>
          <Paragraph>
            Create, pin, archive and search notes stored persistently in PostgreSQL through the
            FastAPI backend.
          </Paragraph>
        </Space>
      </Card>

      <Card>
        <Space className="toolbar" wrap>
          <Input.Search
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
