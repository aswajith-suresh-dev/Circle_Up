import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";         
// pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Challenges from "./pages/Challenges";
import CircleDetail from "./pages/circles/CircleDetail";
import PostDetail from "./pages/posts/PostDetail";
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
import PersonalSpace from "./pages/personal/PersonalSpace";
import FolderDetail from "./pages/personal/FolderDetail";
import ChangePassword from "./pages/auth/ChangePassword";
import SelectTopics from "./pages/auth/SelectTopics";
import SuggestedCircles from "./pages/circles/SuggestedCircles";
import Profile from "./pages/personal/Profile";
import DemoNavbar from "./components/DemoNavbar";
import AdminMentorRequests from "./pages/admin/AdminMentorRequests";

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();
// useEffect(() => {
//   if (user && (!user.topics || user.topics.length === 0)) {
//     navigate("/select-topics");
//   }
// }, [user, navigate]);
  return (
    <>    <DemoNavbar />
    <Routes>
      {/* <Route path="/" element={<Navigate to="/home" />} /> */}
      {/* Public routes */}
      
      <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
        <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }/>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
  path="/select-topics"
  element={
    <PrivateRoute>
      <SelectTopics />
    </PrivateRoute>
  }
/>
<Route
  path="/suggested-circles"
  element={
    <PrivateRoute>
      <SuggestedCircles />
    </PrivateRoute>
  }
/>
<Route
  path="/change-password"
  element={
    <PrivateRoute>
      <ChangePassword />
    </PrivateRoute>
  }
/>      {/* Protected routes */}
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

      <Route path="/apply-mentor" element={
          <ProtectedRoute>
            <ApplyMentor />
          </ProtectedRoute>} />
      {/* <Route
        path="/space"
        element={
          <ProtectedRoute>
            <PersonalSpace />
          </ProtectedRoute>
        }
      /> */}
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

<Route
  path="/admin/mentor-requests"
  element={
    <ProtectedRoute>
      <AdminMentorRequests />
    </ProtectedRoute>
  }
/>
      <Route path="/complaint" element={<Complaint />} />

      <Route path="/admin/complaints" element={<AdminComplaints />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/admin/feedback" element={<AdminFeedback />} />
      <Route path="/personal" element={<PersonalSpace />} />
<Route
  path="/personal/folders/:folderId"
  element={<FolderDetail />}
/>
      {/* <Route
  path="/challenges"
  element={
    <ProtectedRoute>
      <ChallengeList />
    </ProtectedRoute>
  }
/> */}
    </Routes>
    </>

  );
}

export default App;
