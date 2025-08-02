import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Mail from "./pages/Mail";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/mail"
          element={
            <ProtectedRoute>
              <Mail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
