
const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://friendstamilmp3.in/';
const CATALOGUE_URL = new URL('index.php', BASE_URL).href;

const client = axios.create({
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0',
    Accept: 'text/html,application/xhtml+xml',
  },
});

async function fetchPage(params) {
  const response = await client.get(CATALOGUE_URL, { params });
  return cheerio.load(response.data);
}

async function getMovies(letter = 'A') {
  const selectedLetter = letter.toUpperCase();

  if (!/^[A-Z]$/.test(selectedLetter) && selectedLetter !== 'OTHER') {
    throw new Error('Invalid catalogue letter');
  }

  const $ = await fetchPage({
    page: 'A-Z Movie Songs',
    cpage: selectedLetter,
  });

  const movies = [];

  $('#general .folder a').each((_, element) => {
    const anchor = $(element);
    const name = anchor.text().trim();
    const href = anchor.attr('href');

    if (!name || !href) return;

    const link = new URL(href, BASE_URL);
    const albumName = link.searchParams.get('spage');

    if (!albumName) return;

    movies.push({
      id: albumName,
      name,
      albumName,
    });
  });

  return movies;
}

async function getAlbumSongs(albumName) {
  if (!albumName || typeof albumName !== 'string') {
    throw new Error('Album name is required');
  }

  const $ = await fetchPage({
    page: 'A-Z Movie Songs',
    spage: albumName,
  });

  const songs = [];

  $('a[href]').each((_, element) => {
    const anchor = $(element);
    const href = anchor.attr('href');

    if (!href || !/\.mp3(?:$|\?)/i.test(href)) return;

    let audioUrl;

    try {
      audioUrl = new URL(href, BASE_URL);
    } catch {
      return;
    }

    if (
      audioUrl.protocol !== 'https:' ||
      !['friendstamilmp3.in'].includes(
        audioUrl.hostname
      )
    ) {
      return;
    }

    const filename = decodeURIComponent(
      audioUrl.pathname.split('/').pop() || ''
    );

    const title =
      anchor.text().trim() ||
      filename.replace(/\.mp3$/i, '').replace(/[_-]/g, ' ');

    songs.push({
      id: audioUrl.href,
      title,
      artist: 'Unknown Artist',
      album: albumName,
      audioUrl: audioUrl.href,
    });
  });

  return [...new Map(songs.map(song => [song.id, song])).values()];
}

module.exports = {
  getMovies,
  getAlbumSongs,
};
