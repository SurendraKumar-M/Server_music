const express = require('express');
const { fetchMovieSongs } = require('../services/musicService');

const router = express.Router();

router.get('/:movieId', async (req, res) => {
  try {
    const movieId = req.params.movieId;

    if (!movieId || movieId.length > 200) {
      return res.status(400).json({
        message: 'Invalid movie name.',
      });
    }

    const songs = await fetchMovieSongs(movieId);

    res.json({
      album: movieId,
      total: songs.length,
      songs,
    });
  } catch (error) {
    console.error('Song catalogue error:', error.message);

    res.status(500).json({
      message: 'Unable to fetch songs.',
    });
  }
});

module.exports = router;