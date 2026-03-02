import { Routes, Route } from "react-router-dom";
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
import CreateCircle from "./pages/circles/CreateCircle";
import CreatePost from "./pages/posts/CreatePosts";
import ChallengeDays from "./pages/challenges/ChallengeDays";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import MyCircles from "./pages/circles/MyCircles";
import AdminPanel from "./pages/admin/AdminPanel";
import ApplyMentor from "./pages/mentor/ApplyMentor";
import Mentors from "./pages/mentor/Mentors";
import Complaint from "./pages/support/Complaint";
import AdminComplaints from "./pages/admin/AdminComplaints";
import Feedback from "./pages/support/Feedback";
import AdminFeedback from "./pages/support/AdminFeedback";
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

      <Route path="/admin" element={<AdminPanel />} />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        }
      />

      <Route path="/mentors" element={<Mentors />} />
      <Route
        path="/challenges"
        element={
          <ProtectedRoute>
            <Challenges />
          </ProtectedRoute>
        }
      />
      <Route
        path="/challenges/:challengeId"
        element={
          <ProtectedRoute>
            <ChallengeDays />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment/:challengeId"
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-success"
        element={
          <ProtectedRoute>
            <PaymentSuccess />
          </ProtectedRoute>
        }
      />

      <Route path="/apply-mentor" element={<ApplyMentor />} />
      <Route
        path="/space"
        element={
          <ProtectedRoute>
            <PersonalSpace />
          </ProtectedRoute>
        }
      />
      <Route path="/create-circle" element={<CreateCircle />} />

      <Route
        path="/circles/:circleId"
        element={
          <ProtectedRoute>
            <CircleDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/circles/:circleId/create-post"
        element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        }
      />
      <Route path="/my-circles" element={<MyCircles />} />
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

      <Route path="/complaint" element={<Complaint />} />

      <Route path="/admin/complaints" element={<AdminComplaints />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/admin/feedback" element={<AdminFeedback />} />
      {/* <Route
  path="/challenges"
  element={
    <ProtectedRoute>
      <ChallengeList />
    </ProtectedRoute>
  }
/> */}
    </Routes>
  );
}

export default App;
