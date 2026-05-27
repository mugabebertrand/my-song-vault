const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const auth = require('../middleware/auth');

// Get all songs for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const songs = await Song.find({ user: req.user.id });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new song
router.post('/', auth, async (req, res) => {
  try {
    const song = new Song({ ...req.body, user: req.user.id });
    await song.save();
    res.status(201).json(song);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a song
router.delete('/:id', auth, async (req, res) => {
  try {
    await Song.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Song deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;