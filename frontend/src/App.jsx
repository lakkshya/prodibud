import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import MailInbox from "./pages/MailInbox";
import MailTrash from "./pages/MailTrash";
import MailCompose from "./pages/MailCompose";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/mail/inbox"
          element={
            <ProtectedRoute>
              <MailInbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mail/inbox/:id"
          element={
            <ProtectedRoute>
              <MailInbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mail/trash"
          element={
            <ProtectedRoute>
              <MailTrash />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mail/trash/:id"
          element={
            <ProtectedRoute>
              <MailTrash />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mail/compose"
          element={
            <ProtectedRoute>
              <MailCompose />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
