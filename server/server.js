require('dotenv').config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Song routes
const songRoutes = require('./routes/song');
app.use('/api/songs', songRoutes);

// Playlist routes
const playlistRoutes = require('./routes/playlist');
app.use('/api/playlists', playlistRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});