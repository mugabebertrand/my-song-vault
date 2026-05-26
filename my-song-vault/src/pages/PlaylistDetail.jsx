import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

function PlaylistDetail() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`http://localhost:5000/api/playlists/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPlaylist(data))
      .catch((err) => console.error("Error fetching playlist:", err));
  }, [id]);

  useEffect(() => {
    if (currentIndex === null || !playlist) return;

    const song = playlist.songs[currentIndex];
    const match = song.youtubeUrl?.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    const videoId = match ? match[1] : null;
    if (!videoId) return;

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    function createPlayer() {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      playerRef.current = new window.YT.Player("yt-player", {
        height: "315",
        width: "560",
        videoId,
        playerVars: { autoplay: 1 },
        events: {
          onStateChange: (event) => {
            if (event.data === 0) {
              setCurrentIndex((prev) => {
                if (prev < playlist.songs.length - 1) return prev + 1;
                return null;
              });
            }
          },
        },
      });
    }

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
    }
  }, [currentIndex, playlist]);

  function handleRemoveSong(songId) {
    fetch(`http://localhost:5000/api/playlists/${id}/songs/${songId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() =>
        setPlaylist((prev) => ({
          ...prev,
          songs: prev.songs.filter((s) => s._id !== songId),
        }))
      )
      .catch((err) => console.error("Error removing song:", err));
  }

  function playAll() {
    if (playlist.songs.length > 0) setCurrentIndex(0);
  }

  if (!playlist) return <div className="page"><p>Loading...</p></div>;

  const currentSong = currentIndex !== null ? playlist.songs[currentIndex] : null;

  return (
    <div className="page">
      <h1>{playlist.name}</h1>
      <p style={{ textAlign: "center", color: "#666", marginBottom: "20px" }}>
        {playlist.songs.length} song{playlist.songs.length !== 1 ? "s" : ""}
      </p>

      {playlist.songs.length > 0 && (
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <button className="btn-primary" onClick={playAll}>
            ▶ Play All
          </button>
        </div>
      )}

      {currentSong && (
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <p style={{ marginBottom: "10px", fontWeight: "bold" }}>
            Now Playing: {currentSong.title} — {currentSong.artist}
          </p>
          <div id="yt-player" ref={containerRef}></div>
          <div style={{ marginTop: "15px", display: "flex", gap: "10px", justifyContent: "center" }}>
            {currentIndex > 0 && (
              <button className="btn-primary" onClick={() => setCurrentIndex(currentIndex - 1)}>
                ⏮ Previous
              </button>
            )}
            {currentIndex < playlist.songs.length - 1 && (
              <button className="btn-primary" onClick={() => setCurrentIndex(currentIndex + 1)}>
                ⏭ Next
              </button>
            )}
            <button className="btn-delete" onClick={() => {
              if (playerRef.current) playerRef.current.destroy();
              setCurrentIndex(null);
            }}>
              ⏹ Stop
            </button>
          </div>
        </div>
      )}

      <div className="songs-grid">
        {playlist.songs.map((song, index) => (
          <div
            key={song._id}
            className="song-card"
            style={{ border: currentIndex === index ? "2px solid #0ea5e9" : "" }}
          >
            <div className="song-card-header">
              <p><strong>Title:</strong> {song.title}</p>
            </div>
            <p><strong>Artist:</strong> {song.artist}</p>
            {song.performer && <p><strong>Performer:</strong> {song.performer}</p>}
            <div className="song-card-actions">
              {song.youtubeUrl && (
                <button className="btn-listen" onClick={() => setCurrentIndex(index)}>
                  ▶ Listen
                </button>
              )}
              <button className="btn-delete" onClick={() => handleRemoveSong(song._id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaylistDetail;