import { useEffect, useState } from "react";

const emptyForm = {
  title: "",
  artist: "",
  genre: "",
  mood: "",
  difficulty: "",
  status: "",
  youtubeUrl: "",
};

function Songs() {
  const [songs, setSongs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSongs();
  }, []);

  function fetchSongs() {
    fetch("http://localhost:5000/api/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error("Error fetching songs:", err));
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
    fetch("http://localhost:5000/api/songs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    fetch(`http://localhost:5000/api/songs/${id}`, { method: "DELETE" })
      .then(() => setSongs(songs.filter((s) => s._id !== id)))
      .catch((err) => console.error("Error deleting song:", err));
  }

  function handleFavorite(id) {
    fetch(`http://localhost:5000/api/songs/${id}/favorite`, { method: "PATCH" })
      .then((res) => res.json())
      .then((updated) =>
        setSongs(songs.map((s) => (s._id === updated._id ? updated : s)))
      )
      .catch((err) => console.error("Error toggling favorite:", err));
  }

  return (
    <div className="page">
      <h1>Songs</h1>
      <p className="intro">
        These songs are coming from my Node.js/Express backend API — stored in
        MongoDB.
      </p>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Song"}
        </button>
      </div>

      {showForm && (
        <form className="add-song-form" onSubmit={handleAdd}>
          <h2>Add a New Song</h2>
          {error && <p className="form-error">{error}</p>}
          <input name="title" placeholder="Title *" value={form.title} onChange={handleChange} />
          <input name="artist" placeholder="Artist *" value={form.artist} onChange={handleChange} />
          <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} />
          <input name="mood" placeholder="Mood" value={form.mood} onChange={handleChange} />
          <input name="difficulty" placeholder="Difficulty" value={form.difficulty} onChange={handleChange} />
          <input name="status" placeholder="Status" value={form.status} onChange={handleChange} />
          <input name="youtubeUrl" placeholder="YouTube URL" value={form.youtubeUrl} onChange={handleChange} />
          <button type="submit" className="btn-primary">Save Song</button>
        </form>
      )}

      <div className="songs-grid">
        {songs.map((song) => (
          <div key={song._id} className="song-card">
            <div className="song-card-header">
              <h2>{song.title}</h2>
              <button
                className={`fav-btn ${song.isFavorite ? "fav-active" : ""}`}
                onClick={() => handleFavorite(song._id)}
                title={song.isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {song.isFavorite ? "♥" : "♡"}
              </button>
            </div>
            <p><strong>Artist:</strong> {song.artist}</p>
            <p><strong>Genre:</strong> {song.genre}</p>
            <p><strong>Mood:</strong> {song.mood}</p>
            <p><strong>Difficulty:</strong> {song.difficulty}</p>
            <p><strong>Status:</strong> {song.status}</p>
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