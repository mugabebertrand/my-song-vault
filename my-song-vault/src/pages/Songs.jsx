import { useEffect, useState } from "react";

const emptyForm = {
  title: "",
  artist: "",
  performer: "",
  youtubeUrl: "",
};

function Songs() {
  const [songs, setSongs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [addingToPlaylist, setAddingToPlaylist] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSongs();
    fetchPlaylists();
  }, []);

  function fetchSongs() {
    fetch("https://my-song-vault.onrender.com/api/songs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error("Error fetching songs:", err));
  }

  function fetchPlaylists() {
    fetch("https://my-song-vault.onrender.com/api/playlists", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPlaylists(data))
      .catch((err) => console.error("Error fetching playlists:", err));
  }

  function handleAddToPlaylist(songId, playlistId) {
    fetch(`https://my-song-vault.onrender.com/api/playlists/${playlistId}/songs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ songId }),
    })
      .then((res) => res.json())
      .then(() => {
        setAddingToPlaylist(null);
        setSuccessMsg("Song added to playlist!");
        setTimeout(() => setSuccessMsg(""), 3000);
      })
      .catch((err) => console.error("Error adding to playlist:", err));
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAdd(e) {
    e.preventDefault();
    if (!form.title || !form.artist) {
      setError("Title and Artist are required.");
      return;
    }
    setError("");
    fetch("https://my-song-vault.onrender.com/api/songs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((newSong) => {
        setSongs([...songs, newSong]);
        setForm(emptyForm);
        setShowForm(false);
      })
      .catch((err) => console.error("Error adding song:", err));
  }

  function handleDelete(id) {
    fetch(`https://my-song-vault.onrender.com/api/songs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => setSongs(songs.filter((s) => s._id !== id)))
      .catch((err) => console.error("Error deleting song:", err));
  }

  function handleFavorite(id) {
    fetch(`https://my-song-vault.onrender.com/api/songs/${id}/favorite`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((updated) =>
        setSongs(songs.map((s) => (s._id === updated._id ? updated : s)))
      )
      .catch((err) => console.error("Error toggling favorite:", err));
  }

  const filteredSongs = songs.filter((song) => {
    const q = search.toLowerCase();
    return (
      song.title?.toLowerCase().includes(q) ||
      song.artist?.toLowerCase().includes(q) ||
      song.performer?.toLowerCase().includes(q)
    );
  });

  if (!token) {
    return (
      <div className="page">
        <h1>🎶 Songs</h1>
        <p>Please log in to see your songs.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>🎶 Songs</h1>

      {successMsg && (
        <p style={{ color: "green", textAlign: "center", marginBottom: "15px" }}>
          ✅ {successMsg}
        </p>
      )}

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Song"}
        </button>
      </div>

      {showForm && (
        <form className="add-song-form" onSubmit={handleAdd}>
          <h2>Add a Song</h2>
          {error && <p className="form-error">{error}</p>}
          <input name="title" placeholder="Title *" value={form.title} onChange={handleChange} />
          <input name="artist" placeholder="Artist *" value={form.artist} onChange={handleChange} />
          <input name="performer" placeholder="Performer (optional)" value={form.performer} onChange={handleChange} />
          <input name="youtubeUrl" placeholder="YouTube URL" value={form.youtubeUrl} onChange={handleChange} />
          <button type="submit" className="btn-primary">Save Song</button>
        </form>
      )}

      {/* Search Bar */}
      <div style={{ maxWidth: "480px", margin: "0 auto 30px" }}>
        <input
          type="text"
          placeholder="🔍 Search by title, artist or performer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            fontSize: "15px",
            outline: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        />
      </div>

      {filteredSongs.length === 0 && search && (
        <p style={{ textAlign: "center", color: "#888", marginBottom: "20px" }}>
          No songs found for "{search}"
        </p>
      )}

      <div className="songs-grid">
        {filteredSongs.map((song) => (
          <div key={song._id} className="song-card">
            <div className="song-card-header">
              <p><strong>Title:</strong> {song.title}</p>
              <button
                className={`fav-btn ${song.isFavorite ? "fav-active" : ""}`}
                onClick={() => handleFavorite(song._id)}
                title={song.isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {song.isFavorite ? "♥" : "♡"}
              </button>
            </div>
            <p><strong>Artist:</strong> {song.artist}</p>
            {song.performer && <p><strong>Performer:</strong> {song.performer}</p>}

            {addingToPlaylist === song._id ? (
              <div style={{ marginTop: "10px" }}>
                <select
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) handleAddToPlaylist(song._id, e.target.value);
                  }}
                >
                  <option value="" disabled>Select a playlist...</option>
                  {playlists.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
                <button style={{ marginLeft: "8px" }} onClick={() => setAddingToPlaylist(null)}>
                  Cancel
                </button>
              </div>
            ) : (
              <button
                className="btn-primary"
                style={{ marginTop: "10px", fontSize: "13px", padding: "6px 12px" }}
                onClick={() => setAddingToPlaylist(song._id)}
              >
                + Add to Playlist
              </button>
            )}

            <div className="song-card-actions">
              {song.youtubeUrl && (
                <a href={song.youtubeUrl} target="_blank" rel="noreferrer" className="btn-listen">
                  ▶ Listen
                </a>
              )}
              <button className="btn-delete" onClick={() => handleDelete(song._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Songs;