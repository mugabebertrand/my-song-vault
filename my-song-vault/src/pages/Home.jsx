function Home() {
  return (
    <div className="page">
      <h1>🎵 My Song Vault</h1>

      <p className="intro">
        My Song Vault is a personal music collection app where I can organize
        songs, piano pieces, lyrics, practice notes, and favorite music ideas.
      </p>

      <div className="feature-grid">
        <div className="feature-card">
          <h2>Save Songs</h2>
          <p>Keep track of songs I want to learn, practice, or perform.</p>
        </div>

        <div className="feature-card">
          <h2>Practice Notes</h2>
          <p>Write notes about key, mood, difficulty, and progress.</p>
        </div>

        <div className="feature-card">
          <h2>Favorites</h2>
          <p>Mark special songs that inspire me or belong in my performance list.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;