const tmdb_id = 550; // Fight Club
const language = 'fr-FR';
const TMDB_BASE = 'https://api.themoviedb.org/3';

// Simulation TMDB URL
const tmdbUrl = `${TMDB_BASE}/movie/${tmdb_id}?language=${language}&api_key=VOVRE_CLE`;
console.log('TMDB URL:', tmdbUrl);

// Simulation Embed URLs
const videasyMatch = `https://player.videasy.net/movie/${tmdb_id}?language=fr`;
const vidsrcToMatch = `https://vidsrc.to/embed/movie/${tmdb_id}?lang=fr`;
const embed2Match = `https://www.2embed.cc/embed/${tmdb_id}?lang=fr`;

console.log('Videasy URL:', videasyMatch);
console.log('VidSrc.to URL:', vidsrcToMatch);
console.log('2Embed URL:', embed2Match);
