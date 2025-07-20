const animeId = new URLSearchParams(window.location.search).get('id');

fetch(`https://api.jikan.moe/v4/anime/${animeId}`)
  .then(response => response.json())
  .then(data => {
    const anime = data.data;
    const animeDetails = document.getElementById('anime-details');
    animeDetails.innerHTML = `
      <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
      <h2>${anime.title}</h2>
      <p>${anime.synopsis}</p>
    `;
  });

fetch(`https://api.jikan.moe/v4/anime/${animeId}/episodes`)
  .then(response => response.json())
  .then(data => {
    const episodeList = document.getElementById('episode-list');
    const watched = getWatched(animeId);
    data.data.forEach(episode => {
      const li = document.createElement('li');
      li.className = 'episode-item';
      li.innerHTML = `
        <span>${episode.mal_id}: ${episode.title}</span>
        <input type="checkbox" ${watched.includes(episode.mal_id) ? 'checked' : ''} onchange="toggleWatched(${animeId}, ${episode.mal_id})">
        <button onclick="alert('Video no disponible')">Reproducir</button>
      `;
      episodeList.appendChild(li);
    });
  });
