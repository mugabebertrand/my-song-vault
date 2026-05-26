import { useEffect, useState } from "react";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/songs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setFavorites(data.filter((s) => s.isFavorite)))
      .catch((err) => console.error("Error fetching favorites:", err));
  }, []);

  function handleUnfavorite(id) {
    fetch(`http://localhost:5000/api/songs/${id}/favorite`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => setFavorites(favorites.filter((s) => s._id !== id)))
      .catch((err) => console.error("Error removing favorite:", err));
  }

  return (
    <div className="page">
      <h1>❤️ Favorites</h1>
      <p className="intro">
        Your most loved songs, always within reach.
      </p>

      {favorites.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888", marginTop: "40px" }}>
          No favorites yet — tap ♡ on any song to add it here.
        </p>
      ) : (
        <div className="songs-grid">
          {favorites.map((song) => (
            <div key={song._id} className="song-card">
              <div className="song-card-header">
                <h2>{song.title}</h2>
                <button
                  className="fav-btn fav-active"
                  onClick={() => handleUnfavorite(song._id)}
                  title="Remove from favorites"
                >
                  ♥
                </button>
              </div>
              <p><strong>Artist:</strong> {song.artist}</p>
              {song.youtubeUrl && (
                <div className="song-card-actions">
                  <a href={song.youtubeUrl} target="_blank" rel="noreferrer" className="btn-listen">
                    ▶ Listen
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;