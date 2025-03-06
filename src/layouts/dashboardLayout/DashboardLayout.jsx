import { Outlet, useNavigate } from "react-router-dom";
import "./dashboardLayout.css";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import ChatList from "../../components/chatList/ChatList";
import { FaBars, FaTimes } from "react-icons/fa";
import useStore from "../../store";
import Spinner from "../../components/spinner/Spinner";
import { useCreateNewChat } from "../../helpers/useCreateNewChat";

const DashboardLayout = () => {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();
  const { isSidebarOpen, setIsSidebarOpen } = useStore();
  const { isCreating } = useCreateNewChat();

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!isLoaded || isCreating)
    return (
      <div className="layoutSpinnerContainer">
        <Spinner />
      </div>
    );

  return (
    <div className="dashboardLayout">
      <button
        className={`sidebar-toggle ${isSidebarOpen ? "sidebar-open" : ""}`}
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`menu ${isSidebarOpen ? "open" : ""}`}>
        <ChatList />
      </div>

      {/* Overlay to close sidebar when clicking outside */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
