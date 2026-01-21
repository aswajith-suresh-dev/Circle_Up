import {  Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Challenges from "./pages/Challenges";
import PersonalSpace from "./pages/PersonalSpace";
import CircleDetail from "./pages/circles/CircleDetail";
import PostDetail from "./pages/posts/PostDetail";
import Profile from "./pages/Profile";

function App() {
  return (
  
      <Routes>
        {/* <Route path="/" element={<Navigate to="/home" />} /> */}
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />

        <Route
          path="/challenges"
          element={
            <ProtectedRoute>
              <Challenges />
            </ProtectedRoute>
          }
        />

        <Route
          path="/space"
          element={
            <ProtectedRoute>
              <PersonalSpace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/circles/:circleId"
          element={
            <ProtectedRoute>
              <CircleDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts/:postId"
          element={
            <ProtectedRoute>
              <PostDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
  
  );
}

export default App;