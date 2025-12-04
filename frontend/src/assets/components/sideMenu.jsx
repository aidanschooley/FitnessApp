import 'bootstrap/dist/css/bootstrap.min.css';
// SideMenu.jsx
import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import { FaBars } from "react-icons/fa"; // hamburger icon

function SideMenu() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* Hamburger button — disappears when menu opens */}
      {!show && (
        <Button
          variant="primary"
          onClick={handleShow}
          className="position-fixed top-0 start-0 m-3 z-3"
        >
          <FaBars size={20} />
        </Button>
      )}

      <Offcanvas 
        show={show} 
        onHide={handleClose} 
        placement="start"  
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <ul className="list-unstyled">
            <li><a href="/">Dashboard</a></li>
            <li><a href="/workout">Workout</a></li>
            <li><a href="/goals">Goals</a></li>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default SideMenu;

