import { Layout } from 'antd';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppHeader from './components/AppHeader.jsx';
import NoteDetailsPage from './pages/NoteDetailsPage.jsx';
import NoteFormPage from './pages/NoteFormPage.jsx';
import NotesListPage from './pages/NotesListPage.jsx';

const { Content, Footer } = Layout;

function App() {
  return (
    <Layout className="app-shell">
      <AppHeader />
      <Content className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/notes" replace />} />
          <Route path="/notes" element={<NotesListPage />} />
          <Route path="/notes/new" element={<NoteFormPage />} />
          <Route path="/notes/:id" element={<NoteDetailsPage />} />
          <Route path="/notes/:id/edit" element={<NoteFormPage />} />
        </Routes>
      </Content>
      <Footer className="app-footer">Smart Notes - FastAPI, PostgreSQL, React and Ant Design</Footer>
    </Layout>
  );
}

export default App;
