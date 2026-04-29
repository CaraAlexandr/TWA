import { DeleteOutlined, EditOutlined, RollbackOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Descriptions, Popconfirm, Space, Spin, Tag, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteNote, getNoteById, patchNote } from '../services/api.js';

const { Paragraph, Title } = Typography;

function NoteDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadNote() {
      setLoading(true);
      setError('');
      try {
        const data = await getNoteById(id);
        setNote(data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Could not load note.');
      } finally {
        setLoading(false);
      }
    }

    loadNote();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteNote(id);
      message.success('Note deleted successfully.');
      navigate('/notes');
    } catch (err) {
      message.error(err.response?.data?.detail || 'Could not delete note.');
    }
  };

  const handleToggleArchive = async () => {
    try {
      const updated = await patchNote(id, { is_archived: !note.is_archived });
      setNote(updated);
      message.success(updated.is_archived ? 'Note archived.' : 'Note restored.');
    } catch (err) {
      message.error(err.response?.data?.detail || 'Could not update note.');
    }
  };

  if (loading) {
    return (
      <div className="centered-state">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} showIcon />;
  }

  return (
    <Card>
      <Space direction="vertical" size="large" className="page-stack">
        <Space className="details-heading" wrap>
          <div>
            <Title level={2}>{note.title}</Title>
            <Space wrap>
              {note.tag && <Tag color="blue">{note.tag}</Tag>}
              {note.is_pinned && <Tag color="gold">Pinned</Tag>}
              {note.is_archived ? <Tag>Archived</Tag> : <Tag color="green">Active</Tag>}
            </Space>
          </div>
          <Space wrap>
            <Button icon={<RollbackOutlined />} onClick={() => navigate('/notes')}>
              Back
            </Button>
            <Button icon={<EditOutlined />}>
              <Link to={`/notes/${id}/edit`}>Edit</Link>
            </Button>
            <Button onClick={handleToggleArchive}>{note.is_archived ? 'Restore' : 'Archive'}</Button>
            <Popconfirm
              title="Delete note"
              description="This action cannot be undone."
              okText="Delete"
              okButtonProps={{ danger: true }}
              onConfirm={handleDelete}
            >
              <Button danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        </Space>

        <Paragraph className="note-content">{note.content}</Paragraph>

        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{note.id}</Descriptions.Item>
          <Descriptions.Item label="Created at">{new Date(note.created_at).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Updated at">{new Date(note.updated_at).toLocaleString()}</Descriptions.Item>
        </Descriptions>
      </Space>
    </Card>
  );
}

export default NoteDetailsPage;
