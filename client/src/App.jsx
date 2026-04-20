// import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";

// import ProtectedRoute from "./components/ProtectedRoute";
// import PrivateRoute from "./components/PrivateRoute";
// import LeftSidebar from "./components/layout/LeftSidebar";

// /* ---------------- PAGES ---------------- */

// // Auth
// import Login from "./pages/auth/Login";
// import Signup from "./pages/auth/Signup";
// import ChangePassword from "./pages/auth/ChangePassword";
// import SelectTopics from "./pages/auth/SelectTopics";

// // Main
// import Home from "./pages/Home";
// import Search from "./pages/Search";
// import Challenges from "./pages/Challenges";
// import Notifications from "./pages/notifications/Notifications";
// import Landing from "./pages/Landing";

// // Circles
// import CircleDetail from "./pages/circles/CircleDetail";
// import CreateCircle from "./pages/circles/CreateCircle";
// import MyCircles from "./pages/circles/MyCircles";
// import SuggestedCircles from "./pages/circles/SuggestedCircles";

// // Posts
// import CreatePost from "./pages/posts/CreatePosts";
// import PostDetail from "./pages/posts/PostDetail";

// // Challenges
// import ChallengeDays from "./pages/challenges/ChallengeDays";

// // Payments
// import PaymentPage from "./pages/PaymentPage";
// import PaymentSuccess from "./pages/PaymentSuccess";

// // Mentor
// import ApplyMentor from "./pages/mentor/ApplyMentor";
// import Mentors from "./pages/mentor/Mentors";

// // Admin
// import AdminPanel from "./pages/admin/AdminPanel";
// import AdminMentorRequests from "./pages/admin/AdminMentorRequests";
// import AdminComplaints from "./pages/admin/AdminComplaints";
// import AdminFeedback from "./pages/support/AdminFeedback";

// // Support
// import Complaint from "./pages/support/Complaint";
// import Feedback from "./pages/support/Feedback";

// // Personal Space
// import PersonalSpace from "./pages/personal/PersonalSpace";
// import FolderDetail from "./pages/personal/FolderDetail";
// import Profile from "./pages/personal/Profile";

// function App() {
//   const { user } = useAuth();
//   const location = useLocation();

//   // Hide sidebar on auth pages
//   const hideSidebar =
//     location.pathname === "/login" ||
//     location.pathname === "/signup";

//   return (
//     <div className="app-layout">

//       {/* Sidebar */}
//       {!hideSidebar && user && <LeftSidebar />}

//       {/* Main Content */}
//       <div className="main-content">

//         <Routes>

//           {/* Root redirect */}
//           {/* <Route
//             path="/"
//             element={
//               user
//                 ? <Navigate to="/home" replace />
//                 : <Navigate to="/login" replace />
//             }
//           /> */}
//           <Route path="/" element={<Landing />} />

//           {/* AUTH ROUTES */}
//           <Route
//             path="/login"
//             element={
//               user
//                 ? <Navigate to="/home" replace />
//                 : <Login />
//             }
//           />

//           <Route
//             path="/signup"
//             element={
//               user
//                 ? <Navigate to="/home" replace />
//                 : <Signup />
//             }
//           />

//           {/* PRIVATE ROUTES */}

//           <Route
//             path="/select-topics"
//             element={
//               <PrivateRoute>
//                 <SelectTopics />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/suggested-circles"
//             element={
//               <PrivateRoute>
//                 <SuggestedCircles />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/change-password"
//             element={
//               <PrivateRoute>
//                 <ChangePassword />
//               </PrivateRoute>
//             }
//           />

//           {/* PROTECTED ROUTES */}

//           <Route
//             path="/home"
//             element={
//               <ProtectedRoute>
//                 <Home />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/search"
//             element={
//               <ProtectedRoute>
//                 <Search />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/notifications"
//             element={
//               <ProtectedRoute>
//                 <Notifications />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/challenges"
//             element={
//               <ProtectedRoute>
//                 <Challenges />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/challenges/:challengeId"
//             element={
//               <ProtectedRoute>
//                 <ChallengeDays />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/payment/:challengeId"
//             element={
//               <ProtectedRoute>
//                 <PaymentPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/payment-success"
//             element={
//               <ProtectedRoute>
//                 <PaymentSuccess />
//               </ProtectedRoute>
//             }
//           />

//           {/* CIRCLES */}

//           <Route path="/create-circle" element={<CreateCircle />} />

//           <Route
//             path="/circles/:circleId"
//             element={
//               <ProtectedRoute>
//                 <CircleDetail />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/circles/:circleId/create-post"
//             element={
//               <ProtectedRoute>
//                 <CreatePost />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/my-circles"
//             element={
//               <ProtectedRoute>
//                 <MyCircles />
//               </ProtectedRoute>
//             }
//           />

//           {/* POSTS */}

//           <Route
//             path="/posts/:postId"
//             element={
//               <ProtectedRoute>
//                 <PostDetail />
//               </ProtectedRoute>
//             }
//           />

//           {/* PROFILE */}

//           <Route
//             path="/profile"
//             element={
//               <ProtectedRoute>
//                 <Profile />
//               </ProtectedRoute>
//             }
//           />

//           {/* MENTORS */}

//           <Route path="/mentors" element={<Mentors />} />

//           <Route
//             path="/apply-mentor"
//             element={
//               <ProtectedRoute>
//                 <ApplyMentor />
//               </ProtectedRoute>
//             }
//           />

//           {/* ADMIN */}

//           <Route path="/admin" element={<AdminPanel />} />

//           <Route
//             path="/admin/mentor-requests"
//             element={
//               <ProtectedRoute>
//                 <AdminMentorRequests />
//               </ProtectedRoute>
//             }
//           />

//           <Route path="/admin/complaints" element={<AdminComplaints />} />

//           <Route path="/admin/feedback" element={<AdminFeedback />} />

//           {/* SUPPORT */}

//           <Route path="/complaint" element={<Complaint />} />
//           <Route path="/feedback" element={<Feedback />} />

//           {/* PERSONAL SPACE */}

//           <Route path="/personal" element={<PersonalSpace />} />

//           <Route
//             path="/personal/folders/:folderId"
//             element={<FolderDetail />}
//           />

//         </Routes>

//       </div>
//     </div>
//   );
// }

// export default App;

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import MentorRoute from "./components/MentorRoute";
import AdminRoute from "./components/AdminRoute";

import ProtectedRoute from "./components/ProtectedRoute";
import PrivateRoute from "./components/PrivateRoute";
import LeftSidebar from "./components/layout/LeftSidebar";

/* ---------------- PAGES ---------------- */

// Auth
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/SignUp";
import ChangePassword from "./pages/auth/ChangePassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import SelectTopics from "./pages/auth/SelectTopics";

// Main
import Home from "./pages/Home";
import Search from "./pages/Search";
import Challenges from "./pages/Challenges";
import Notifications from "./pages/notifications/Notifications";
import Landing from "./pages/Landing";

// Circles
import CircleDetail from "./pages/circles/CircleDetail";
import CreateCircle from "./pages/circles/CreateCircle";
import MyCircles from "./pages/circles/MyCircles";
import SuggestedCircles from "./pages/circles/SuggestedCircles";
import EditCircle from "./pages/mentor/EditCircles";
import CircleMembers from "./pages/mentor/CircleMembers";

// Posts
import CreatePost from "./pages/posts/CreatePosts";
import PostDetail from "./pages/posts/PostDetail";
import MyPosts from "./pages/posts/MyPosts";

// Challenges
import ChallengeDays from "./pages/challenges/ChallengeDays";
import EditChallenge from "./pages/mentor/EditChallenge";

// Payments
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSuccess";

// Mentor
import ApplyMentor from "./pages/mentor/ApplyMentor";
import Mentors from "./pages/mentor/Mentors";
import MentorCircles from "./pages/mentor/MentorCircles";
import MentorDashboard from "./pages/mentor/MentorDashboard";
// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMentorRequests from "./pages/admin/AdminMentorRequests";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminFeedback from "./pages/support/AdminFeedback";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCircles from "./pages/admin/AdminCircles";
import AdminManageChallenges from "./pages/admin/AdminManageChallenges";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminChangePassword from "./pages/admin/AdminChangepassword";

// Support
import Complaint from "./pages/support/Complaint";
import Feedback from "./pages/support/Feedback";
import FAQ from "./pages/FAQ";

// Personal Space
import PersonalSpace from "./pages/personal/PersonalSpace";
import FolderDetail from "./pages/personal/FolderDetail";
import Profile from "./pages/personal/Profile";

import CreateChallenge from "./pages/mentor/CreateChallenge";
import MentorChallenges from "./pages/mentor/MentorChallenges";
import AdminChallenges from "./pages/admin/AdminChallenges";
import MentorStatus from "./pages/mentor/MentorStatus";
import ChallengeReviews from "./pages/challenges/ChallengeReviews";
import ChallengeOverview from "./pages/mentor/ChallengeOverview";

import MentorRevenue from "./pages/mentor/MentorRevenue";
import AdminRevenue from "./pages/admin/AdminRevenue";
import AdminChallengeOverview from "./pages/admin/AdminChallengeOverview";
import ChallengeAllReviews from "./pages/challenges/ChallengeAllReviews";
function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait until AuthContext loads profile
  if (loading) {
    return null; // or a loading spinner
  }

  /* ---------------- SIDEBAR CONTROL ---------------- */

  const authPages = [
    "/",
    "/login",
    "/signup",
    "/select-topics",
    "/suggested-circles",
  ];
  const isAdminRoute = location.pathname.startsWith("/admin");

  const hideSidebar =
    authPages.includes(location.pathname) ||
    location.pathname.startsWith("/payment") ||
    isAdminRoute;
  const hasTopics = user && user.topics && user.topics.length > 0;

  return (
    <div className="app-layout">
      {/* Sidebar */}
      {!hideSidebar && user && <LeftSidebar />}

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          {/* LANDING PAGE */}
          <Route
            path="/"
            element={
              user ? (
                user.role === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : hasTopics ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Navigate to="/select-topics" replace />
                )
              ) : (
                <Landing />
              )
            }
          />
          {/* LOGIN */}
          <Route
            path="/login"
            element={
              user ? (
                hasTopics ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Navigate to="/select-topics" replace />
                )
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/challenges/:challengeId/reviews"
            element={
              <ProtectedRoute>
                <ChallengeReviews />
              </ProtectedRoute>
            }
          />
          {/* SIGNUP */}
          <Route
            path="/signup"
            element={
              user ? (
                hasTopics ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Navigate to="/select-topics" replace />
                )
              ) : (
                <Signup />
              )
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* ONBOARDING */}
          <Route
            path="/select-topics"
            element={
              <PrivateRoute>
                <SelectTopics />
              </PrivateRoute>
            }
          />
          <Route
            path="/mentor/revenue"
            element={
              <MentorRoute>
                <MentorRevenue />
              </MentorRoute>
            }
          />
          <Route
            path="/my-posts"
            element={
              <ProtectedRoute>
                <MyPosts />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/admin/revenue"
            element={
              <AdminRoute>
                <AdminRevenue />
              </AdminRoute>
            }
          /> */}
          <Route
            path="/mentor/circles"
            element={
              <MentorRoute>
                <MentorCircles />
              </MentorRoute>
            }
          />
          <Route
  path="/mentor/circle/:circleId/members"
  element={
    <MentorRoute>
      <CircleMembers />
    </MentorRoute>
  }
/>
          <Route
            path="/mentor/challenge/:challengeId/overview"
            element={
              <MentorRoute>
                <ChallengeOverview />
              </MentorRoute>
            }
          />
          <Route
            path="/edit-circle/:circleId"
            element={
              <MentorRoute>
                <EditCircle />
              </MentorRoute>
            }
          />{" "}
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
          />
          <Route
            path="/mentor-status"
            element={
              <ProtectedRoute>
                <MentorStatus />
              </ProtectedRoute>
            }
          />
          {/* MAIN APP */}
          <Route
            path="/home"
            element={
              user?.role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : user && (!user.topics || user.topics.length === 0) ? (
                <Navigate to="/select-topics" replace />
              ) : (
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              )
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
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
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
          {/* CIRCLES */}
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
          <Route
            path="/my-circles"
            element={
              <ProtectedRoute>
                <MyCircles />
              </ProtectedRoute>
            }
          />
          {/* POSTS */}
          <Route
            path="/posts/:postId"
            element={
              <ProtectedRoute>
                <PostDetail />
              </ProtectedRoute>
            }
          />
          {/* PROFILE */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faq"
            element={
              <ProtectedRoute>
                <FAQ />
              </ProtectedRoute>
            }
          />
          {/* MENTORS */}
          <Route path="/mentors" element={<Mentors />} />
          <Route
            path="/apply-mentor"
            element={
              <ProtectedRoute>
                <ApplyMentor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges/:challengeId/all-reviews"
            element={
              <ProtectedRoute>
                <ChallengeAllReviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor"
            element={
              <ProtectedRoute>
                <MentorDashboard />
              </ProtectedRoute>
            }
          />
          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />

            <Route path="users" element={<AdminUsers />} />

            <Route
              path="manage-challenges"
              element={<AdminManageChallenges />}
            />
            <Route
              path="challenges/:challengeId/overview"
              element={<AdminChallengeOverview />}
            />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="circles" element={<AdminCircles />} />
            <Route path="change-password" element={<AdminChangePassword />} />
            <Route path="challenges" element={<AdminChallenges />} />

            <Route path="mentor-requests" element={<AdminMentorRequests />} />

            <Route path="complaints" element={<AdminComplaints />} />

            <Route path="feedback" element={<AdminFeedback />} />

            <Route path="revenue" element={<AdminRevenue />} />
          </Route>{" "}
          {/* <Route
            path="/admin/mentor-requests"
            element={
              <AdminRoute>
                <AdminMentorRequests />
              </AdminRoute>
            }
          /> */}
          {/* <Route
            path="/admin/complaints"
            element={
              <AdminRoute>
                <AdminComplaints />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/feedback"
            element={
              <AdminRoute>
                <AdminFeedback />
              </AdminRoute>
            }
          />{" "} */}
          {/* SUPPORT */}
          <Route path="/complaint" element={<Complaint />} />
          <Route path="/feedback" element={<Feedback />} />
          {/* PERSONAL SPACE */}
          <Route path="/personal" element={<PersonalSpace />} />
          <Route
            path="/personal/folders/:folderId"
            element={<FolderDetail />}
          />
          <Route
            path="/mentor/create-challenge"
            element={
              <MentorRoute>
                <CreateChallenge />
              </MentorRoute>
            }
          />
          <Route
            path="/edit-challenge/:challengeId"
            element={
              <MentorRoute>
                <EditChallenge />
              </MentorRoute>
            }
          />
          <Route
            path="/mentor/challenges"
            element={
              <MentorRoute>
                <MentorChallenges />
              </MentorRoute>
            }
          />
          {/* <Route
            path="/admin/challenges"
            element={
              <AdminRoute>
                <AdminChallenges />
              </AdminRoute>
            }
          />{" "} */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
