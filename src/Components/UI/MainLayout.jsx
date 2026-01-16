import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

/**
 * MainLayout component that provides the common layout structure
 * with the sidebar for authenticated routes.
 */
const MainLayout = () => {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 flex justify-center overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
