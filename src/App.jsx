import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminTodayTasks from "./pages/admin/TodayTasks";
import AdminPendingTasks from "./pages/admin/PendingTasks";
import KpiKra from "./pages/admin/KpiKra";
import UserDashboard from "./pages/user/Dashboard";
import Commitment from "./pages/admin/Commitment";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import NotFound from "./pages/NotFound";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <RequireAuth role="admin">
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="today-tasks" element={<AdminTodayTasks />} />
        <Route path="pending-tasks" element={<AdminPendingTasks />} />
        <Route path="commitment" element={<Commitment />} />
        <Route path="kpi-kra" element={<KpiKra />} />
      </Route>

      {/* User Routes */}
      <Route
        path="/user"
        element={
          <RequireAuth role="user">
            <UserLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/user/dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboard />} />
      </Route>

      <Route
        path="/"
        element={
          <Navigate
            to={user ? (user.role === "admin" ? "/admin" : "/user") : "/login"}
            replace
          />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Authentication guard component
function RequireAuth({ children, role }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/user"} replace />;
  }

  return children;
}

export default App;
