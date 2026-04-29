import { Layout } from 'antd';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppHeader from './components/AppHeader.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NoteDetailsPage from './pages/NoteDetailsPage.jsx';
import NoteFormPage from './pages/NoteFormPage.jsx';
import NotesListPage from './pages/NotesListPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

const { Content, Footer } = Layout;

function App() {
  return (
    <Layout className="app-shell">
      <AppHeader />
      <Content className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/notes" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/notes" element={<NotesListPage />} />
            <Route path="/notes/new" element={<NoteFormPage />} />
            <Route path="/notes/:id" element={<NoteDetailsPage />} />
            <Route path="/notes/:id/edit" element={<NoteFormPage />} />
          </Route>
        </Routes>
      </Content>
      <Footer className="app-footer">Smart Notes - FastAPI, PostgreSQL, React and Ant Design</Footer>
    </Layout>
  );
}

export default App;
