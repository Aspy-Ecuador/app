import SideMenu from "@components/SideMenu";
import { Outlet } from "react-router-dom";

const ClientLayout = () => (
  <div style={{ display: "flex", minHeight: "100dvh" }}>
    <SideMenu />
    <div style={{ flex: 1 }}>
      <Outlet />
    </div>
  </div>
);

export default ClientLayout;
