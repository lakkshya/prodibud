import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import MailInbox from "./pages/MailInbox";

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
      </Routes>
    </>
  );
}

export default App;
