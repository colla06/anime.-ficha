// js/main.js - Generador de Ficha Anime
// Última actualización: 16 de julio de 2025, 23:23 CEST

// Función para alternar el tema claro/oscuro
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const icon = document.querySelector('#themeToggle i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// Función para buscar y rellenar datos del anime usando Jikan API
document.getElementById('searchButton').addEventListener('click', async () => {
    const searchQuery = document.getElementById('searchQuery').value;
    const loader = document.getElementById('loader');
    loader.classList.remove('hidden');

    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${searchQuery}`);
        console.log('Respuesta de la API:', response); // Depuración
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        console.log('Datos recibidos:', data); // Depuración

        if (!data.data) throw new Error('No se encontraron datos para este ID');

        document.getElementById('tituloPrincipal').value = data.data.title || '';
        document.getElementById('tituloAlternativo').value = data.data.titles?.find(t => t.type === 'English')?.title || '';
        document.getElementById('sinopsis').value = data.data.synopsis || '';
        document.getElementById('urlPortada').value = data.data.images?.jpg.large_image_url || '';
        document.getElementById('estudio').value = data.data.studios?.map(studio => studio.name).join(', ') || '';
        document.getElementById('urlMyAnimeList').value = data.data.url || '';
        document.getElementById('episodios').value = data.data.episodes || '';
        document.getElementById('duracion').value = data.data.duration ? data.data.duration.replace(' per ep.', ' min') : '';
        document.getElementById('temporadaAño').value = data.data.year || '';
        document.getElementById('temporadaEstacion').value = data.data.season || 'invierno';

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
});

// Función para generar el HTML de la ficha
function generateHTML() {
    const formData = {
        tituloPrincipal: document.getElementById('tituloPrincipal').value,
        tituloAlternativo: document.getElementById('tituloAlternativo').value,
        sinopsis: document.getElementById('sinopsis').value,
        urlPortada: document.getElementById('urlPortada').value,
        estudio: document.getElementById('estudio').value,
        urlMyAnimeList: document.getElementById('urlMyAnimeList').value,
        urlAniList: document.getElementById('urlAniList').value,
        trailerUrl: document.getElementById('trailerUrl').value,
        estado: document.querySelector('input[name="estado"]:checked').value,
        proxEpisodio: document.getElementById('proxEpisodio').value,
        duracion: document.getElementById('duracion').value,
        temporadaEstacion: document.getElementById('temporadaEstacion').value,
        temporadaAño: document.getElementById('temporadaAño').value,
        tipo: document.querySelector('input[name="tipo"]:checked').value,
        episodios: document.getElementById('episodios').value,
        tags: Array.from(document.getElementById('tags').selectedOptions).map(opt => opt.value),
        videoIframe: document.getElementById('videoIframe').value,
        contrasena: document.getElementById('contrasena').value,
        fansub720: document.getElementById('fansub720').value,
        subtitulos720: Array.from(document.getElementById('subtitulos720').selectedOptions).map(opt => opt.value),
        idioma720: Array.from(document.getElementById('idioma720').selectedOptions).map(opt => opt.value),
        encoder720: document.getElementById('encoder720').value,
        formato720: document.getElementById('formato720').value,
        resolucion720: document.getElementById('resolucion720').value,
        comprimido720: document.querySelector('input[name="comprimido720"]:checked').value,
        calidad720: document.getElementById('calidad720').value,
        tamaño720: document.getElementById('tamaño720').value,
        servidores720: Array.from(document.getElementById('servidores720').selectedOptions).map(opt => opt.value),
        uploader720: document.getElementById('uploader720').value,
        enlaces720: document.getElementById('enlaces720').value,
        fansub1080: document.getElementById('fansub1080').value,
        subtitulos1080: Array.from(document.getElementById('subtitulos1080').selectedOptions).map(opt => opt.value),
        idioma1080: Array.from(document.getElementById('idioma1080').selectedOptions).map(opt => opt.value),
        ripper1080: document.getElementById('ripper1080').value,
        raw1080: document.getElementById('raw1080').value,
        encode1080: document.getElementById('encode1080').value,
        muxeo1080: document.getElementById('muxeo1080').value,
        formato1080: document.getElementById('formato1080').value,
        resolucion1080: document.getElementById('resolucion1080').value,
        comprimido1080: document.querySelector('input[name="comprimido1080"]:checked').value,
        calidad1080: document.getElementById('calidad1080').value,
        tamaño1080: document.getElementById('tamaño1080').value,
        servidores1080: Array.from(document.getElementById('servidores1080').selectedOptions).map(opt => opt.value),
        uploader1080: document.getElementById('uploader1080').value,
        enlaces1080: document.getElementById('enlaces1080').value
    };

    let html = `
        <div class="ficha-anime">
            <h1>${formData.tituloPrincipal} ${formData.tituloAlternativo ? `(${formData.tituloAlternativo})` : ''}</h1>
            <img src="${formData.urlPortada}" alt="${formData.tituloPrincipal} Portada" class="portada">
            <p><strong>Sinopsis:</strong> ${formData.sinopsis}</p>
            <p><strong>Estudio(s):</strong> ${formData.estudio}</p>
            <p><strong>URL MyAnimeList:</strong> <a href="${formData.urlMyAnimeList}" target="_blank">${formData.urlMyAnimeList}</a></p>
            <p><strong>URL AniList:</strong> <a href="${formData.urlAniList}" target="_blank">${formData.urlAniList}</a></p>
            <p><strong>Trailer:</strong> <a href="${formData.trailerUrl}" target="_blank">${formData.trailerUrl}</a></p>
            <p><strong>Estado:</strong> ${formData.estado}</p>
            <p><strong>Próximo Episodio:</strong> ${formData.proxEpisodio}</p>
            <p><strong>Duración:</strong> ${formData.duracion}</p>
            <p><strong>Temporada:</strong> ${formData.temporadaEstacion} ${formData.temporadaAño}</p>
            <p><strong>Tipo:</strong> ${formData.tipo}</p>
            <p><strong>Episodios:</strong> ${formData.episodios}</p>
            <p><strong>Géneros:</strong> ${formData.tags.join(', ')}</p>
            <div>${formData.videoIframe}</div>
            <p><strong>Contraseña:</strong> ${formData.contrasena}</p>

            <h2>720p HDL</h2>
            <p><strong>Fansub:</strong> ${formData.fansub720}</p>
            <p><strong>Subtítulos:</strong> ${formData.subtitulos720.join(', ')}</p>
            <p><strong>Idioma (Audio):</strong> ${formData.idioma720.join(', ')}</p>
            <p><strong>Encoder:</strong> ${formData.encoder720}</p>
            <p><strong>Formato:</strong> ${formData.formato720}</p>
            <p><strong>Resolución:</strong> ${formData.resolucion720}</p>
            <p><strong>Comprimido:</strong> ${formData.comprimido720}</p>
            <p><strong>Calidad:</strong> ${formData.calidad720}</p>
            <p><strong>Tamaño por archivo:</strong> ${formData.tamaño720}</p>
            <p><strong>Servidores:</strong> ${formData.servidores720.join(', ')}</p>
            <p><strong>Uploader:</strong> ${formData.uploader720}</p>
            <p><strong>Enlaces:</strong> ${formData.enlaces720}</p>

            <h2>1080p FHD</h2>
            <p><strong>Fansub:</strong> ${formData.fansub1080}</p>
            <p><strong>Subtítulos:</strong> ${formData.subtitulos1080.join(', ')}</p>
            <p><strong>Idioma (Audio):</strong> ${formData.idioma1080.join(', ')}</p>
            <p><strong>Ripper:</strong> ${formData.ripper1080}</p>
            <p><strong>Raw:</strong> ${formData.raw1080}</p>
            <p><strong>Encode:</strong> ${formData.encode1080}</p>
            <p><strong>Muxeo:</strong> ${formData.muxeo1080}</p>
            <p><strong>Formato:</strong> ${formData.formato1080}</p>
            <p><strong>Resolución:</strong> ${formData.resolucion1080}</p>
            <p><strong>Comprimido:</strong> ${formData.comprimido1080}</p>
            <p><strong>Calidad:</strong> ${formData.calidad1080}</p>
            <p><strong>Tamaño por archivo:</strong> ${formData.tamaño1080}</p>
            <p><strong>Servidores:</strong> ${formData.servidores1080.join(', ')}</p>
            <p><strong>Uploader:</strong> ${formData.uploader1080}</p>
            <p><strong>Enlaces:</strong> ${formData.enlaces1080}</p>
        </div>
    `;

    // Actualizar vista previa
    document.getElementById('preview').innerHTML = html;

    // Copiar HTML al área de salida
    document.getElementById('htmlOutput').value = html;
}

// Función para copiar el HTML al portapapeles
function copyHTML() {
    const htmlOutput = document.getElementById('htmlOutput');
    htmlOutput.select();
    document.execCommand('copy');
    alert('HTML copiado al portapapeles!');
}

// Función para añadir nuevas opciones a los select
function addOption(selectId, inputId, allowDuplicates = false) {
    const select = document.getElementById(selectId);
    const input = document.getElementById(inputId);
    const newOption = input.value.trim();

    if (newOption && (allowDuplicates || !Array.from(select.options).some(opt => opt.value === newOption))) {
        const option = document.createElement('option');
        option.value = newOption;
        option.text = newOption;
        select.appendChild(option);
        input.value = '';
    }
}

// Cargar tema guardado al iniciar
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.remove('dark');
        document.querySelector('#themeToggle i').classList.replace('fa-moon', 'fa-sun');
    }
});
