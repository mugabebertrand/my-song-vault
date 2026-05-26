import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/songs">Songs</Link>
      <Link to="/playlists">Playlists</Link>
      <Link to="/favorites">Favorites</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
      {token ? (
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}

export default Navbar;