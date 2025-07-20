function getWatched(animeId) {
  return JSON.parse(localStorage.getItem('watched_' + animeId)) || [];
}

function setWatched(animeId, episodeIds) {
  localStorage.setItem('watched_' + animeId, JSON.stringify(episodeIds));
}

function toggleWatched(animeId, episodeId) {
  let watched = getWatched(animeId);
  if (watched.includes(episodeId)) {
    watched = watched.filter(id => id != episodeId);
  } else {
    watched.push(episodeId);
  }
  setWatched(animeId, watched);
}
