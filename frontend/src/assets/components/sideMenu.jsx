import e from "express";

function SideMenu() {
  return (
    <div className="bg-light border-right" style={{ width: '250px', minHeight: '100vh' }}>
      <div className="sidebar-heading p-3">Side Menu</div>
      <div className="list-group list-group-flush">
        <a href="#" className="list-group-item list-group-item-action bg-light">Dashboard</a>
        <a href="#" className="list-group-item list-group-item-action bg-light">Profile</a>
        <a href="#" className="list-group-item list-group-item-action bg-light">Settings</a>
        <a href="#" className="list-group-item list-group-item-action bg-light">Logout</a>
      </div>
    </div>
  );
}

export default SideMenu;