import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import Inbox from "./pages/mail/Inbox";
import Trash from "./pages/mail/Trash";
import Compose from "./pages/mail/Compose";
import Drafts from "./pages/mail/Drafts";
import Sent from "./pages/mail/Sent";
import Boards from "./pages/kanban/Boards";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mail/inbox"
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mail/inbox/:id"
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mail/trash"
          element={
            <ProtectedRoute>
              <Trash />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mail/trash/:id"
          element={
            <ProtectedRoute>
              <Trash />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mail/compose"
          element={
            <ProtectedRoute>
              <Compose />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mail/drafts"
          element={
            <ProtectedRoute>
              <Drafts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mail/drafts/:id"
          element={
            <ProtectedRoute>
              <Drafts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mail/sent"
          element={
            <ProtectedRoute>
              <Sent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mail/sent/:id"
          element={
            <ProtectedRoute>
              <Sent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kanban/boards"
          element={
            <ProtectedRoute>
              <Boards />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
