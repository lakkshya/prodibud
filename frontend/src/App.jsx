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
import CreateBoard from "./pages/kanban/CreateBoard";
import SingleBoard from "./pages/kanban/SingleBoard";

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
          path="/kanban/create-board"
          element={
            <ProtectedRoute>
              <CreateBoard />
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
        <Route
          path="/kanban/board/:id"
          element={
            <ProtectedRoute>
              <SingleBoard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
