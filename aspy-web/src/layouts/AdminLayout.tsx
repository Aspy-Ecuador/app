import SideMenu from "@components/SideMenu";
import { Outlet } from "react-router-dom";

const AdminLayout = () => (
  <div style={{ display: "flex", minHeight: "100dvh" }}>
    <SideMenu />
    <div style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      <Outlet />
    </div>
  </div>
);

export default AdminLayout;
