function Home() {
  return (
    <div className="page">
      <h1>🎵 Song Vault</h1>
      <p className="intro">
        Your personal music library. Save songs, build playlists, and listen to everything you love — all in one place.
      </p>

      <div className="feature-grid">
        <div className="feature-card">
          <h2>🎶 Your Songs</h2>
          <p>Add and organize all the songs you love, learn, or perform.</p>
        </div>
        <div className="feature-card">
          <h2>📋 Playlists</h2>
          <p>Group your songs into playlists and play them nonstop.</p>
        </div>
        <div className="feature-card">
          <h2>❤️ Favorites</h2>
          <p>Keep your most loved songs one tap away.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;