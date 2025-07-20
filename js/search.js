function searchAnime() {
  const query = document.getElementById('search-input').value;
  window.location.href = `search.html?q=${encodeURIComponent(query)}`;
}

fetch('https://api.jikan.moe/v4/seasons/now')
  .then(response => response.json())
  .then(data => {
    const animeGrid = document.getElementById('anime-grid');
    data.data.forEach(anime => {
      const card = document.createElement('div');
      card.className = 'anime-card';
      card.innerHTML = `
        <a href="anime.html?id=${anime.mal_id}">
          <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
          <h3>${anime.title}</h3>
          <p>Episodios: ${anime.episodes || 'N/A'}</p>
        </a>
      `;
      animeGrid.appendChild(card);
    });
  });
