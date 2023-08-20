import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const {currentUser} = useContext(AuthContext);

  const ProtectedRoute = ({children}) => {
    if(!currentUser) {
      return <Navigate to="/login" />
    }
    return children
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
            <Route path="/register" element={currentUser ? <Navigate to="/" /> : <Register />} />
            <Route path="/login" element={ currentUser ? <Navigate to="/" /> : <Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;