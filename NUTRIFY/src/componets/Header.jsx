import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Headers() {
  const navigate = useNavigate();
  const loggedData = useContext(UserContext);

  function logout() {
    localStorage.removeItem("nurtrify-user");
    loggedData.setLoggedUser(null);
    navigate("/login");
  }

  return (
    <header className="header">
      <div className="nav-container">
        <div className="logo">NutriTrack</div>
        <nav>
          <ul className="nav-links">
            <li><Link to="/track">Track</Link></li>
            <li><Link to="/diet">Diet</Link></li>
            <li><button onClick={logout} className="logout-btn">Logout</button></li>

          </ul>
        </nav>
      </div>
    </header>
  );
}
