import { Alert, Space, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NoteForm from '../components/NoteForm.jsx';
import { createNote, getNoteById, updateNote } from '../services/api.js';

const { Title, Paragraph } = Typography;

function NoteFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    async function loadNote() {
      setLoading(true);
      setError('');
      try {
        const data = await getNoteById(id);
        setInitialValues(data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Could not load note.');
      } finally {
        setLoading(false);
      }
    }

    loadNote();
  }, [id, isEditing]);

  const pageCopy = useMemo(
    () =>
      isEditing
        ? {
            title: 'Edit note',
            description: 'Update the selected note and keep the changes in PostgreSQL.',
          }
        : {
            title: 'Create note',
            description: 'Add a new note using the FastAPI CRUD endpoint.',
          },
    [isEditing],
  );

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        tag: values.tag?.trim() || null,
      };
      const savedNote = isEditing ? await updateNote(id, payload) : await createNote(payload);
      message.success(isEditing ? 'Note updated successfully.' : 'Note created successfully.');
      navigate(`/notes/${savedNote.id}`);
    } catch (err) {
      message.error(err.response?.data?.detail || 'Could not save note.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Space direction="vertical" size="large" className="page-stack">
      <div>
        <Title level={2}>{pageCopy.title}</Title>
        <Paragraph>{pageCopy.description}</Paragraph>
      </div>
      {error && <Alert type="error" message={error} showIcon />}
      <NoteForm
        initialValues={initialValues}
        loading={loading}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </Space>
  );
}

export default NoteFormPage;
