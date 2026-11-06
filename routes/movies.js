const express = require('express');
const { fetchMovies } = require('../services/musicService');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const letter = String(req.query.letter || 'A').toUpperCase();

    if (!/^[A-Z]$|^OTHER$/.test(letter)) {
      return res.status(400).json({
        message: 'Invalid letter. Use A-Z or Other.',
      });
    }

    const movies = await fetchMovies(letter);

    res.json({
      letter,
      total: movies.length,
      movies,
    });
  } catch (error) {
    console.error('Movie catalogue error:', error.message);

    res.status(500).json({
      message: 'Unable to fetch movies.',
    });
  }
});

module.exports = router;