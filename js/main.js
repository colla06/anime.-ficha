try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${searchQuery}`);
    console.log('Respuesta de la API:', response);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    console.log('Datos recibidos:', data);

    if (!data.data) throw new Error('No se encontraron datos para este ID');

    // Traducir la sinopsis al español
    let translatedSynopsis = data.data.synopsis || '';
    if (translatedSynopsis) {
        translatedSynopsis = await translateToSpanish(translatedSynopsis);
    }

    document.getElementById('tituloPrincipal').value = data.data.title || '';
    document.getElementById('tituloAlternativo').value = data.data.titles?.find(t => t.type === 'English')?.title || '';
    document.getElementById('sinopsis').value = translatedSynopsis;
    document.getElementById('urlPortada').value = data.data.images?.jpg.large_image_url || '';
    document.getElementById('estudio').value = data.data.studios?.map(studio => studio.name).join(', ') || '';
    document.getElementById('urlMyAnimeList').value = data.data.url || '';
    document.getElementById('episodios').value = data.data.episodes || '';
    document.getElementById('duracion').value = data.data.duration ? data.data.duration.replace(' per ep.', ' min') : '';
    document.getElementById('temporadaAño').value = data.data.year || '';
    document.getElementById('temporadaEstacion').value = data.data.season || 'invierno';
    document.getElementById('trailerUrl').value = data.data.trailer?.url || '';

    // Consulta a AniList para obtener la URL
    const aniListResponse = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
                query ($search: Int) {
                    Media(search: $search, type: ANIME) {
                        id
                        siteUrl
                    }
                }
            `,
            variables: { search: parseInt(searchQuery) }
        })
    });
    if (aniListResponse.ok) {
        const aniListData = await aniListResponse.json();
        const aniListUrl = aniListData.data.Media?.siteUrl || '';
        document.getElementById('urlAniList').value = aniListUrl;
    } else {
        console.warn('No se pudo obtener la URL de AniList');
    }

    const estadoRadios = document.querySelectorAll('input[name="estado"]');
    estadoRadios.forEach(radio => {
        if (radio.value.toLowerCase() === data.data.status?.toLowerCase().replace(' ', '')) radio.checked = true;
    });
} catch (error) {
    console.error('Error al buscar el anime:', error);
    alert(`Error: ${error.message}. Verifica el ID o intenta de nuevo más tarde.`);
} finally {
    loader.classList.add('hidden');
}
