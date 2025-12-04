// src/pages/Dashboard.jsx
import SideMenu from "../components/sideMenu.jsx";
import ActivityAnalyzer from "../components/ActivityAnalyzer.jsx";

function Dashboard() {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <SideMenu />

      {/* Main content */}
      <div className="flex-grow-1 p-4">
        <h1>Dashboard Page</h1>
        <h3>Welcome to the Dashboard!</h3>
        <p>Your main content goes here.</p>
        <ActivityAnalyzer />
      </div>
    </div>
  );
}

export default Dashboard;
