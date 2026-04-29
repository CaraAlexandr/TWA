import { Button, Card, Form, Input, Space, Switch } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

function NoteForm({ initialValues, loading, submitting, onSubmit }) {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    form.setFieldsValue({
      title: '',
      content: '',
      tag: '',
      is_pinned: false,
      is_archived: false,
      ...initialValues,
    });
  }, [form, initialValues]);

  return (
    <Card loading={loading} className="form-card">
      <Form form={form} layout="vertical" onFinish={onSubmit} requiredMark="optional">
        <Form.Item
          label="Title"
          name="title"
          rules={[
            { required: true, message: 'Please enter a note title.' },
            { max: 200, message: 'The title can have at most 200 characters.' },
          ]}
        >
          <Input placeholder="Example: Laboratory deployment checklist" />
        </Form.Item>

        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: 'Please enter the note content.' }]}
        >
          <TextArea rows={8} placeholder="Write the note content here..." />
        </Form.Item>

        <Form.Item label="Tag" name="tag" rules={[{ max: 100, message: 'The tag is too long.' }]}>
          <Input placeholder="school, backend, ideas..." />
        </Form.Item>

        <Space size="large" wrap>
          <Form.Item label="Pinned" name="is_pinned" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="Archived" name="is_archived" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Space>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Save Note
            </Button>
            <Button onClick={() => navigate(-1)}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default NoteForm;
