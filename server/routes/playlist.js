const express = require("express");
const router = express.Router();
const Playlist = require("../models/Playlist");
const auth = require("../middleware/auth");

// Get all playlists for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    console.log("USER FROM TOKEN:", req.user);

    const userId = req.user.id || req.user._id;

    const playlists = await Playlist.find({ user: userId }).populate("songs");
    res.json(playlists);
  } catch (err) {
    console.error("GET PLAYLIST ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create a new playlist
router.post("/", auth, async (req, res) => {
  try {
    console.log("CREATE PLAYLIST BODY:", req.body);
    console.log("USER FROM TOKEN:", req.user);

    const userId = req.user.id || req.user._id;

    if (!req.body.name) {
      return res.status(400).json({ message: "Playlist name is required" });
    }

    const playlist = new Playlist({
      name: req.body.name,
      user: userId,
      songs: [],
    });

    await playlist.save();

    res.status(201).json(playlist);
  } catch (err) {
    console.error("CREATE PLAYLIST ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add a song to a playlist
router.post("/:id/songs", auth, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const playlist = await Playlist.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    playlist.songs.push(req.body.songId);
    await playlist.save();

    res.json(playlist);
  } catch (err) {
    console.error("ADD SONG TO PLAYLIST ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a playlist
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    await Playlist.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    res.json({ message: "Playlist deleted" });
  } catch (err) {
    console.error("DELETE PLAYLIST ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// Get a single playlist
router.get('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, user: req.user.id }).populate('songs');
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a song from a playlist
router.delete('/:id/songs/:songId', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, user: req.user.id });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    playlist.songs = playlist.songs.filter(s => s.toString() !== req.params.songId);
    await playlist.save();
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;