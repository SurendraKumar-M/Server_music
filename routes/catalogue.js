
const express = require('express');
const router = express.Router();

const {
  getMovies,
  getAlbumSongs,
} = require('../services/musicService');

// GET /api/movies?letter=A
router.get('/movies', async (req, res) => {
  try {
    const letter = req.query.letter || 'A';
    const movies = await getMovies(letter);

    res.json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    console.error('Movie catalogue error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch movie catalogue',
    });
  }
});

// GET /api/albums/songs?name=A%20(1998)
router.get('/albums/songs', async (req, res) => {
  try {
    const albumName = req.query.name;
    const songs = await getAlbumSongs(albumName);

    res.json({
      success: true,
      count: songs.length,
      data: songs,
    });
  } catch (error) {
    console.error('Album songs error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch album songs',
    });
  }
});

module.exports = router;
