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

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Song schema
const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  genre: String,
  mood: String,
  difficulty: String,
  status: String,
  isFavorite: { type: Boolean, default: false },
  youtubeUrl: String,
});

const Song = mongoose.model("Song", songSchema);

// GET all songs
app.get("/api/songs", async (req, res) => {
  const songs = await Song.find();
  res.json(songs);
});

// GET one song
app.get("/api/songs/:id", async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) return res.status(404).json({ message: "Song not found" });
  res.json(song);
});

// POST new song
app.post("/api/songs", async (req, res) => {
  const song = new Song(req.body);
  await song.save();
  res.status(201).json(song);
});

// PATCH toggle favorite
app.patch("/api/songs/:id/favorite", async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) return res.status(404).json({ message: "Song not found" });
  song.isFavorite = !song.isFavorite;
  await song.save();
  res.json(song);
});

// DELETE song
app.delete("/api/songs/:id", async (req, res) => {
  await Song.findByIdAndDelete(req.params.id);
  res.json({ message: "Song deleted successfully" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});