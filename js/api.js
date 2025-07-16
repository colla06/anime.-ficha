const ACCESS_TOKEN = 'TU_TOKEN_DE_MYANIMELIST_AQUI'; // Reemplaza con tu token válido

async function searchAnime() {
    const searchQuery = document.getElementById('searchQuery').value.trim();
    if (!searchQuery) {
        alert('Por favor, ingresa un ID de MyAnimeList.');
        return;
    }

    const loader = document.getElementById('loader');
    loader.classList.remove('hidden');

    try {
        const response = await fetch(`https://api.myanimelist.net/v2/anime/${searchQuery}?fields=id,title,main_picture,synopsis,genres,start_date,end_date,mean,episodes,studios`, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error en la API: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        if (!data || !data.title) {
            throw new Error('No se encontraron datos para este ID.');
        }

        // Rellenar el formulario con los datos
        const tituloPrincipal = document.getElementById('tituloPrincipal');
        const tituloAlternativo = document.getElementById('tituloAlternativo');
        const sinopsis = document.getElementById('sinopsis');
        const urlPortada = document.getElementById('urlPortada');
        const estudio = document.getElementById('estudio');
        const urlMyAnimeList = document.getElementById('urlMyAnimeList');
        const episodios = document.getElementById('episodios');
        const temporadaAño = document.getElementById('temporadaAño');

        if (tituloPrincipal) tituloPrincipal.value = data.title || '';
        if (tituloAlternativo) tituloAlternativo.value = data.alternative_titles?.en || '';
        if (sinopsis) sinopsis.value = data.synopsis || '';
        if (urlPortada) urlPortada.value = data.main_picture?.large || data.main_picture?.medium || '';
        if (estudio) estudio.value = data.studios?.map(studio => studio.name).join(', ') || '';
        if (urlMyAnimeList) urlMyAnimeList.value = `https://myanimelist.net/anime/${data.id}`;
        if (episodios) episodios.value = data.episodes ? `${data.episodes}` : '';
        if (temporadaAño) temporadaAño.value = data.start_date ? new Date(data.start_date).getFullYear() : '';

        // Rellenar géneros si existen
        const tags = document.getElementById('tags');
        if (tags && data.genres) {
            const genreValues = data.genres.map(genre => genre.name.toLowerCase());
            Array.from(tags.options).forEach(option => {
                option.selected = genreValues.includes(option.value.toLowerCase());
            });
        }

        alert('Datos cargados exitosamente.');
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        alert(`Error al cargar los datos: ${error.message}`);
    } finally {
        loader.classList.add('hidden');
    }
}

// Asociar el evento al botón de búsqueda
document.getElementById('searchButton').addEventListener('click', searchAnime);
