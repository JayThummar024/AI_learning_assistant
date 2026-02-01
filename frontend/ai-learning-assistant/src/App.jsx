import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import DocumentListPage from "./pages/documents/DocumentListPage";
import DocumentDetailsPage from "./pages/documents/DocumentDetailsPage";
import FlashcardListPage from "./pages/flashcards/FlashcardListPage";
import FlashcardPage from "./pages/flashcards/FlashcardPage";
import QuizResultsPage from "./pages/quizzes/QuizResultsPage";
import ProfilePage from "./pages/profile/ProfilePage";    
import ProtectedRoute from "./components/auth/ProtectedRoutes";

function App() {
  const isAuthenticated = false;
  const loading = false;

  if (loading) {
    return (
      <div className="className">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes Here */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path='/documents' element={<DocumentListPage/>} />
          <Route path='/documents/:id' element={<DocumentDetailsPage/>} />
          <Route path='/flashcards' element={<FlashcardPage/>} />
          <Route path="/documents/:id/flashcards" element={<FlashcardListPage/>} />
          <Route path="/quizzes/:quizId/results" element={<QuizResultsPage />} />
          <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
          <Route path="/profile" element={<ProfilePage />} />

        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
