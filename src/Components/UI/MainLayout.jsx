import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

/**
 * MainLayout component that provides the common layout structure
 * with the sidebar for authenticated routes.
 */
const MainLayout = () => {
    return (
        <div className="flex justify-start h-screen">
            <Sidebar />
            <Outlet />
        </div>
    );
};

export default MainLayout;
