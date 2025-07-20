// Local storage for watched episodes
const watchedEpisodes = JSON.parse(localStorage.getItem('watchedEpisodes')) || {};

// MyAnimeList API (using Jikan API by ID)
async function searchMyAnimeListById(id) {
  try {
    document.getElementById('loading')?.classList.remove('hidden');
    document.getElementById('error')?.classList.add('hidden');
    const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    const data = await response.json();
    document.getElementById('loading')?.classList.add('hidden');
    if (data.data) {
      return {
        title: data.data.title,
        image: data.data.images.jpg.large_image_url,
        synopsis: await translateSynopsis(data.data.synopsis || "Sin sinopsis disponible.")
      };
    }
    document.getElementById('error')?.textContent = 'No se encontró el anime con ese ID.';
    document.getElementById('error')?.classList.remove('hidden');
    return null;
  } catch (error) {
    document.getElementById('loading')?.classList.add('hidden');
    document.getElementById('error')?.textContent = 'Error al buscar en MyAnimeList.';
    document.getElementById('error')?.classList.remove('hidden');
    console.error('Error fetching from MyAnimeList:', error);
    return null;
  }
}

// MyAnimeList API (using Jikan API for search suggestions)
async function searchMyAnimeList(query) {
  try {
    document.getElementById('loading')?.classList.remove('hidden');
    document.getElementById('error')?.classList.add('hidden');
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=5`);
    const data = await response.json();
    document.getElementById('loading')?.classList.add('hidden');
    if (data.data && data.data.length > 0) {
      return await Promise.all(data.data.map(async anime => ({
        title: anime.title,
        image: anime.images.jpg.large_image_url,
        synopsis: await translateSynopsis(anime.synopsis || "Sin sinopsis disponible.")
      })));
    }
    document.getElementById('error')?.textContent = 'No se encontró el anime.';
    document.getElementById('error')?.classList.remove('hidden');
    return [];
  } catch (error) {
    document.getElementById('loading')?.classList.add('hidden');
    document.getElementById('error')?.textContent = 'Error al buscar en MyAnimeList.';
    document.getElementById('error')?.classList.remove('hidden');
    console.error('Error fetching from MyAnimeList:', error);
    return [];
  }
}

// Translate synopsis using MyMemory API
async function translateSynopsis(text) {
  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|es`);
    const data = await response.json();
    return data.responseData.translatedText || text;
  } catch (error) {
    console.error('Error translating synopsis:', error);
    return text; // Fallback to original text if translation fails
  }
}

// Autocomplete for MyAnimeList ID (admin page)
if (document.getElementById('animeId')) {
  document.getElementById('animeId').addEventListener('input', async (e) => {
    const id = e.target.value;
    if (!id || isNaN(id)) return;
    const anime = await searchMyAnimeListById(id);
    if (anime) {
      document.getElementById('animeTitle').value = anime.title;
      document.getElementById('animeImage').value = anime.image;
      document.getElementById('animeSynopsis').value = anime.synopsis;
    }
  });
}

// Generator form submission (admin page)
if (document.getElementById('animeForm')) {
  document.getElementById('animeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const episode1Url = document.getElementById('episode1Url').value;
    if (!episode1Url.startsWith('mpv://')) {
      document.getElementById('error').textContent = 'La URL del episodio debe comenzar con mpv://';
      document.getElementById('error').classList.remove('hidden');
      return;
    }
    const newAnime = {
      id: animeData.length + 1,
      title: document.getElementById('animeTitle').value,
      image: document.getElementById('animeImage').value,
      synopsis: document.getElementById('animeSynopsis').value,
      episodes: [
        { number: 1, title: "Episodio 1", url: episode1Url }
      ]
    };
    animeData.push(newAnime);
    latestEpisodes.push({ anime: newAnime.title, episode: newAnime.episodes[0] });
    localStorage.setItem('animeData', JSON.stringify(animeData));
    localStorage.setItem('latestEpisodes', JSON.stringify(latestEpisodes));
    document.getElementById('animeForm').reset();
    document.getElementById('error').classList.add('hidden');
    alert('Anime añadido con éxito.');
  });
}

// Search suggestions (main page)
if (document.getElementById('searchInput')) {
  document.getElementById('searchInput').addEventListener('input', async (e) => {
    const query = e.target.value;
    const suggestionsContainer = document.getElementById('searchSuggestions');
    suggestionsContainer.innerHTML = '';
    if (query.length < 3) {
      suggestionsContainer.classList.add('hidden');
      renderAnimeList();
      return;
    }
    const animes = await searchMyAnimeList(query);
    if (animes.length > 0) {
      suggestionsContainer.classList.remove('hidden');
      animes.forEach(anime => {
        const div = document.createElement('div');
        div.className = 'suggestion p-2 flex items-center';
        div.innerHTML = `
          <img src="${anime.image}" class="w-12 h-16 object-cover rounded mr-2">
          <span>${anime.title}</span>
        `;
        div.addEventListener('click', () => {
          document.getElementById('searchInput').value = anime.title;
          suggestionsContainer.classList.add('hidden');
          renderAnimeList(anime.title);
        });
        suggestionsContainer.appendChild(div);
      });
    } else {
      suggestionsContainer.classList.add('hidden');
    }
    renderAnimeList(query);
  });
}

// Render latest episodes
function renderLatestEpisodes() {
  const container = document.getElementById('latestEpisodesList');
  if (!container) return;
  container.innerHTML = '';
  latestEpisodes.forEach(item => {
    const isWatched = watchedEpisodes[`${item.anime}-${item.episode.number}`];
    const card = `
      <div class="card p-4 bg-gray-900 rounded flex items-center">
        <img src="${animeData.find(a => a.title === item.anime).image}" class="w-16 h-20 object-cover rounded mr-4">
        <div>
          <h3 class="font-semibold">${item.anime}</h3>
          <p>${item.episode.title}</p>
          <a href="${item.episode.url}" class="text-blue-400">Ver en MPV</a>
          <button onclick="toggleWatched('${item.anime}', ${item.episode.number})" class="ml-2 text-sm ${isWatched ? 'watched' : ''}">
            ${isWatched ? 'Visto' : 'Marcar Visto'}
          </button>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });
}

// Render anime list
function renderAnimeList(filter = '') {
  const container = document.getElementById('animeListContainer');
  if (!container) return;
  container.innerHTML = '';
  animeData
    .filter(anime => anime.title.toLowerCase().includes(filter.toLowerCase()))
    .forEach(anime => {
      const card = `
        <div class="card p-4 bg-gray-900 rounded cursor-pointer" onclick="showAnimeDetails(${anime.id})">
          <img src="${anime.image}" class="w-full h-48 object-cover rounded mb-2">
          <h3 class="font-semibold">${anime.title}</h3>
          <p class="text-sm text-gray-400">${anime.synopsis}</p>
        </div>
      `;
      container.innerHTML += card;
    });
}

// Show anime details in modal
function showAnimeDetails(animeId) {
  const anime = animeData.find(a => a.id === animeId);
  if (!anime) return;
  
  document.getElementById('modalImage').src = anime.image;
  document.getElementById('modalTitle').textContent = anime.title;
  document.getElementById('modalSynopsis').textContent = anime.synopsis;
  
  const episodesContainer = document.getElementById('modalEpisodes');
  episodesContainer.innerHTML = '';
  anime.episodes.forEach(ep => {
    const isWatched = watchedEpisodes[`${anime.title}-${ep.number}`];
    const li = `
      <li class="flex justify-between items-center">
        <span>${ep.title}</span>
        <div>
          <a href="${ep.url}" class="text-blue-400 mr-2">Ver en MPV</a>
          <button onclick="toggleWatched('${anime.title}', ${ep.number})" class="text-sm ${isWatched ? 'watched' : ''}">
            ${isWatched ? 'Visto' : 'Marcar Visto'}
          </button>
        </div>
      </li>
    `;
    episodesContainer.innerHTML += li;
  });
  
  document.getElementById('animeModal').classList.remove('hidden');
}

// Toggle watched status
function toggleWatched(animeTitle, episodeNumber) {
  const key = `${animeTitle}-${episodeNumber}`;
  if (watchedEpisodes[key]) {
    delete watchedEpisodes[key];
  } else {
    watchedEpisodes[key] = true;
  }
  localStorage.setItem('watchedEpisodes', JSON.stringify(watchedEpisodes));
  renderLatestEpisodes();
  if (!document.getElementById('animeModal').classList.contains('hidden')) {
    const anime = animeData.find(a => a.title === animeTitle);
    showAnimeDetails(anime.id);
  }
}

// Close modal
if (document.getElementById('closeModal')) {
  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('animeModal').classList.add('hidden');
  });
}

// Load saved data from localStorage
function loadData() {
  const savedAnime = localStorage.getItem('animeData');
  const savedLatest = localStorage.getItem('latestEpisodes');
  if (savedAnime) animeData = JSON.parse(savedAnime);
  if (savedLatest) latestEpisodes = JSON.parse(savedLatest);
}

// Initial render
loadData();
renderLatestEpisodes();
renderAnimeList();
