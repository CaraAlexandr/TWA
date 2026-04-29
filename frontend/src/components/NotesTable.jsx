import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Empty, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Text } = Typography;

function NotesTable({ notes, loading, onDelete, onTogglePin, onToggleArchive }) {
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title, note) => (
        <Space direction="vertical" size={0}>
          <Link to={`/notes/${note.id}`} className="note-title-link">
            {title}
          </Link>
          <Text type="secondary" ellipsis className="note-preview">
            {note.content}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
      width: 140,
      render: (tag) => (tag ? <Tag color="blue">{tag}</Tag> : <Text type="secondary">No tag</Text>),
    },
    {
      title: 'Status',
      key: 'status',
      width: 190,
      render: (_, note) => (
        <Space wrap>
          {note.is_pinned && <Tag color="gold">Pinned</Tag>}
          {note.is_archived ? <Tag color="default">Archived</Tag> : <Tag color="green">Active</Tag>}
        </Space>
      ),
    },
    {
      title: 'Updated',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 170,
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 330,
      render: (_, note) => (
        <Space wrap>
          <Button icon={<EyeOutlined />}>
            <Link to={`/notes/${note.id}`}>View</Link>
          </Button>
          <Button icon={<EditOutlined />}>
            <Link to={`/notes/${note.id}/edit`}>Edit</Link>
          </Button>
          <Button onClick={() => onTogglePin(note)}>{note.is_pinned ? 'Unpin' : 'Pin'}</Button>
          <Button onClick={() => onToggleArchive(note)}>
            {note.is_archived ? 'Restore' : 'Archive'}
          </Button>
          <Popconfirm
            title="Delete note"
            description="This action cannot be undone."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(note.id)}
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={notes}
      loading={loading}
      locale={{ emptyText: <Empty description="No notes found" /> }}
      pagination={{ pageSize: 8, showSizeChanger: false }}
      scroll={{ x: 960 }}
    />
  );
}

export default NotesTable;
