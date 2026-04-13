// ═══════════════════════════════════════════
//  Sources de streaming pour ISVERSE
//  Priorisées pour le contenu en VF (français)
// ═══════════════════════════════════════════
import { useState, useEffect } from 'react';

export interface VideoSource {
  name: string;
  url: string;
}

function buildSources(
  tmdbId: number,
  type: 'movie' | 'tv',
  season: number,
  episode: number
): VideoSource[] {
  const isMovie = type === 'movie';

  // Sources classées : VF/VOSTFR en priorité, puis sources génériques
  if (isMovie) {
    return [
      { name: 'Frembed (VF)',   url: `https://frembed.cyou/embed/movie/${tmdbId}` },
      { name: 'Videasy (VF)',   url: `https://player.videasy.net/movie/${tmdbId}?language=fr` },
      { name: 'VidSrc.me (VF)', url: `https://vidsrc.me/embed/movie/${tmdbId}?ds_lang=fr` },
      { name: 'VidSrc Pro',     url: `https://vidsrc.pro/embed/movie/${tmdbId}?lang=french` },
      { name: 'VidSrc.to',      url: `https://vidsrc.to/embed/movie/${tmdbId}?lang=french` },
      { name: '2Embed',         url: `https://www.2embed.cc/library/movie/${tmdbId}?lang=fr` },
      { name: 'Embed.su',       url: `https://embed.su/embed/movie/${tmdbId}?lang=french` },
      { name: 'MovieBox',       url: `https://moviesapi.club/movie/${tmdbId}` },
      { name: 'SuperEmbed',     url: `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&lang=french` },
      { name: 'AutoEmbed',      url: `https://autoembed.co/movie/tmdb/${tmdbId}` },
    ];
  } else {
    return [
      { name: 'Frembed (VF)',   url: `https://frembed.cyou/embed/tv/${tmdbId}/${season}/${episode}` },
      { name: 'Videasy (VF)',   url: `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}?language=fr` },
      { name: 'VidSrc.me (VF)', url: `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&sea=${season}&epi=${episode}&ds_lang=fr` },
      { name: 'VidSrc Pro',     url: `https://vidsrc.pro/embed/tv/${tmdbId}/${season}/${episode}?lang=french` },
      { name: 'VidSrc.to',      url: `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}?lang=french` },
      { name: '2Embed',         url: `https://www.2embed.cc/library/tv/${tmdbId}?s=${season}&e=${episode}&lang=fr` },
      { name: 'Embed.su',       url: `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}?lang=french` },
      { name: 'MovieBox',       url: `https://moviesapi.club/tv/${tmdbId}-${season}-${episode}` },
      { name: 'SuperEmbed',     url: `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}&lang=french` },
      { name: 'AutoEmbed',      url: `https://autoembed.co/tv/tmdb/${tmdbId}-${season}-${episode}` },
    ];
  }
}

export function useVideoSource(
  tmdbId: number,
  type: 'movie' | 'tv',
  season = 1,
  episode = 1
) {
  const [sources, setSources] = useState<VideoSource[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!tmdbId) return;
    const newSources = buildSources(tmdbId, type, season, episode);
    setSources(newSources);
    setCurrentIndex(0);
  }, [tmdbId, type, season, episode]);

  const nextSource = () =>
    setCurrentIndex(prev => (prev + 1) % sources.length);

  const prevSource = () =>
    setCurrentIndex(prev => (prev - 1 + sources.length) % sources.length);

  const selectSource = (idx: number) =>
    setCurrentIndex(Math.max(0, Math.min(idx, sources.length - 1)));

  return {
    currentSource: sources[currentIndex] ?? null,
    sources,
    currentIndex,
    totalSources: sources.length,
    nextSource,
    prevSource,
    selectSource,
    loading: sources.length === 0,
  };
}
