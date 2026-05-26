import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) fetchPlaylists();
  }, [token]);

  function fetchPlaylists() {
    fetch("http://localhost:5000/api/playlists", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPlaylists(data);
        else setError(data.message || "Could not load playlists.");
      })
      .catch(() => setError("Error fetching playlists."));
  }

  function handleCreate(e) {
    e.preventDefault();
    setError("");
    if (!newName.trim()) {
      setError("Please enter a playlist name.");
      return;
    }
    fetch("http://localhost:5000/api/playlists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newName }),
    })
      .then((res) => res.json())
      .then((playlist) => {
        if (!playlist._id) {
          setError(playlist.message || "Playlist was not created.");
          return;
        }
        setPlaylists((prev) => [...prev, playlist]);
        setNewName("");
      })
      .catch(() => setError("Error creating playlist."));
  }

  function handleDelete(id) {
    fetch(`http://localhost:5000/api/playlists/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => setPlaylists((prev) => prev.filter((p) => p._id !== id)))
      .catch(() => setError("Error deleting playlist."));
  }

  if (!token) {
    return (
      <div className="page">
        <h1>Playlists</h1>
        <p>Please log in to see your playlists.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Playlists</h1>

      <form className="add-song-form" onSubmit={handleCreate}>
        <h2>Create a Playlist</h2>
        <input
          type="text"
          placeholder="Playlist name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit" className="btn-primary">Create</button>
      </form>

      {error && <p style={{ color: "red", textAlign: "center", marginTop: "15px" }}>{error}</p>}

      <div className="songs-grid">
        {playlists.map((playlist) => (
          <div key={playlist._id} className="song-card">
            <h2>{playlist.name}</h2>
            <p><strong>Songs:</strong> {playlist.songs?.length || 0}</p>
            <div className="song-card-actions">
              <button
                className="btn-primary"
                onClick={() => navigate(`/playlists/${playlist._id}`)}
              >
                View
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDelete(playlist._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Playlists;