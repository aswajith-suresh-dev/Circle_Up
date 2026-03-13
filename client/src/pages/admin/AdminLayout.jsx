import AdminSidebar from "../../components/admin/AdminSidebar";
import { Outlet } from "react-router-dom";
import "../../css/Admin.css";

const AdminLayout = () => {
  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-main">
        <Outlet />
      </div>

    </div>
  );
};

export default AdminLayout;