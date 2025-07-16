import { showNotice } from './utils.js';

export function generateHTML() {
    const form = document.getElementById('animeForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    data.subtitulos720 = formData.getAll('subtitulos720').join(', ');
    data.idioma720 = formData.getAll('idioma720').join(', ');
    data.servidores720 = formData.getAll('servidores720').join(', ');
    data.subtitulos1080 = formData.getAll('subtitulos1080').join(', ');
    data.idioma1080 = formData.getAll('idioma1080').join(', ');
    data.servidores1080 = formData.getAll('servidores1080').join(', ');
    data.tags = formData.getAll('tags');
    data.rawEncode1080 = `${data.raw1080 || ''} / ${data.encode1080 || ''}`;

    const seasonTags = ['2025 verano', '2025 otoño', '2025 invierno', '2025 primavera'];
    const tagsHTML = data.tags.map(tag => {
        if (seasonTags.includes(tag)) {
            const displayTag = tag.replace(/(\d{4}) (\w+)/, (match, year, season) =>
                `${year} ${season.charAt(0).toUpperCase() + season.slice(1)}`
            );
            const urlTag = encodeURIComponent(displayTag);
            return `<span><a href="/search/label/${urlTag}">${displayTag}</a></span>`;
        }
        return `<span><a href="/search/label/${tag}">${tag}</a></span>`;
    }).join('\n');

    const htmlContent = `
<main class="anime-main">
    <section>
        <div class="notes">
            <p>[Descarga] ${data.tituloPrincipal}: HDL MP4 - FHD MKV</p>
        </div>
    </section>
    <section class="anime-info">
        <div class="anime-info__cover">
            <img src="${data.urlPortada}" alt="cover">
        </div>
        <div class="anime-info__content">
            <div class="content__titles">
                <p class="titles--main">${data.tituloPrincipal}</p>
                ${data.tituloAlternativo ? `<p class="titles--alt">${data.tituloAlternativo}</p>` : ''}
            </div>
            <div class="content__misc">
                <div class="misc__studios">
                    <span>${data.estudio}</span>
                </div>
                <div class="misc__links">
                    ${data.urlMyAnimeList ? `<a href="${data.urlMyAnimeList}" target="_blank">MyAList</a>` : ''}
                    ${data.urlAniList ? `<a href="${data.urlAniList}" target="_blank">AList</a>` : ''}
                </div>
            </div>
            <div class="content__synopsis">
                <h2 class="synopsis__title">SINOPSIS</h2>
                <p class="synopsis__content">${data.sinopsis}<!--more--></p>
            </div>
        </div>
    </section>
    <div class="content__details">
        <div class="airing-status">
            <span><b>ESTADO:</b></span> ${data.estado}
            <br>
            ${data.proxEpisodio ? `<span>PRÓX. EPISODIO:</span> ${data.proxEpisodio}` : ''}
        </div>
        <span id="duration">
            <svg class="i i-clock" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 7v5l3 3"></path>
            </svg>
            Duración:<br>${data.duracion}
        </span>
        <span class="season">
            <svg class="i i-calendar" viewBox="0 0 24 24">
                <rect width="18" height="17" x="3" y="5" rx="2"></rect>
                <path d="M7 2v3m10-3v3M3 10h18"></path>
            </svg>
            Temporada:<br><a href="/search/label/${data.temporadaAño}%20${data.temporadaEstacion.charAt(0).toUpperCase() + data.temporadaEstacion.slice(1)}">${data.temporadaEstacion.charAt(0).toUpperCase() + data.temporadaEstacion.slice(1)} ${data.temporadaAño}</a>
        </span>
        <span id="format">
            <svg class="i i-tv-retro" viewBox="0 0 24 24">
                <rect width="20" height="15" x="2" y="7" rx="3"></rect>
                <path d="m7 2 5 5 5-5"></path>
            </svg>
            Tipo:<br>${data.tipo}
        </span>
        <span>
            <svg class="i i-list" viewBox="0 0 24 24">
                <path d="M7 6h14M7 12h14M7 18h14M3 6h0m0 6h0m0 18h0"></path>
            </svg>
            Episodios:<br><b>${data.episodios}</b>
        </span>
    </div>
    <section class="anime-related">
        ${data.trailerUrl ? `<a href="${data.trailerUrl}" rel="nofollow" target="_blank"><i aria-hidden="true" class="fa fa-youtube-play"></i> <b>TRAILER</b> <i aria-hidden="true" class="fa fa-external-link"></i></a>` : ''}
        <a href="#" target="_blank"><span><b>Precuela:</b></span> No Disponible</a>
    </section>
    <div class="bookmark-actions-container" id="bookmark-container">
        <span class="bookmark-actions-title"><b>Marcar esta entrada:</b></span>
        <div class="bookmark-buttons">
            <button class="bookmark-btn" id="btn-follow">👁️ Seguir</button>
            <button class="bookmark-btn" id="btn-favorite">⭐ Favorito</button>
            <button class="bookmark-btn" id="btn-plan">📝 En Plan</button>
        </div>
    </div>
    <hr class="break-line">
    ${data.videoIframe ? `
    <div class="main-player-container">
        <div class="video-player-section">
            <div class="video-player-header">
                <div class="controls-group">
                    <div class="control-item audio-control">
                        <label for="audio-option-select"><i class="fa fa-file-audio-o" aria-hidden="true"></i></label>
                        <select id="audio-option-select" onchange="changeAudioOption()">
                            <option value="japones">Japonés</option>
                            <option value="espanol">Español</option>
                            <option value="dual">Dual (LA/JA)</option>
                            <option value="castellano">Castellano</option>
                            <option value="trial">Trial</option>
                        </select>
                    </div>
                    <div class="control-item video-option-control">
                        <label for="episode-option-select"><i class="fa fa-server" aria-hidden="true"></i></label>
                        <select id="episode-option-select" onchange="changeEpisodeOption()"></select>
                    </div>
                </div>
            </div>
            <div class="video-display">
                <iframe id="video-iframe" src="${data.videoIframe}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <div class="video-title-group">
                <h3 id="video-title">Episodio 1</h3>
                <div class="nav-buttons">
                    <button id="prev-episode-btn" class="nav-button"><span class="arrow"><</span> <span class="text">Anterior</span></button>
                    <button id="next-episode-btn" class="nav-button"><span class="text">Siguiente</span> <span class="arrow">></span></button>
                </div>
            </div>
            <div class="episodes-section">
                <div class="episodes-header">
                    <div class="episodes-title-group">
                        <h3 class="episodes-title"><i class="fa fa-list" aria-hidden="true"></i> Listado</h3>
                    </div>
                    <div class="pagination-controls">
                        <select id="episode-range-select" onchange="changeEpisodeRange()"></select>
                        <input type="number" id="episode-search-input" placeholder="Buscar #" min="1">
                        <button id="episode-search-btn">🔍</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    ` : ''}
    <section class="anime-tags">
        <h2 class="tags__title">GÉNEROS</h2>
        <div class="tags__content">
            ${tagsHTML}
        </div>
    </section>
    <section class="custom-details">
        <div class="tabs">
            <input type="radio" name="tabs" id="tab--1" checked>
            <label for="tab--1">720p HDL</label>
            <input type="radio" name="tabs" id="tab--2">
            <label for="tab--2">1080p FHD</label>
            <div class="tab__panel" id="panel--1">
                <table class="tab-custom-table">
                    <tr><td>Fansub:</td><td>${data.fansub720}</td></tr>
                    <tr><td>Subtítulos:</td><td>${data.subtitulos720}</td></tr>
                    <tr><td>Idioma:</td><td>${data.idioma720}</td></tr>
                    <tr><td>Encoder:</td><td>${data.encoder720}</td></tr>
                    <tr><td>Formato:</td><td>${data.formato720}</td></tr>
                    <tr><td>Resolución:</td><td>${data.resolucion720}</td></tr>
                    <tr><td>Comprimido:</td><td>${data.comprimido720}</td></tr>
                    <tr><td>Calidad:</td><td>${data.calidad720}</td></tr>
                    <tr><td>Tamaño por archivo:</td><td>${data.tamaño720}</td></tr>
                    <tr><td>Servidores:</td><td>${data.servidores720}</td></tr>
                    <tr><td>Uploader:</td><td>${data.uploader720}</td></tr>
                </table>
                <div class="custom-detail__panel">
                    <span id="enlace">${data.contrasena}</span>
                    <br>
                    <a href="${data.enlaces720}" rel="nofollow" target="_blank">Enlace</a>
                </div>
            </div>
            <div class="tab__panel" id="panel--2">
                <table class="tab-custom-table">
                    <tr><td>Fansub:</td><td>${data.fansub1080}</td></tr>
                    <tr><td>Subtítulos:</td><td>${data.subtitulos1080}</td></tr>
                    <tr><td>Idioma:</td><td>${data.idioma1080}</td></tr>
                    <tr><td>Ripper:</td><td>${data.ripper1080}</td></tr>
                    <tr><td>Raw/Encode:</td><td>${data.rawEncode1080}</td></tr>
                    <tr><td>Muxeo:</td><td>${data.muxeo1080}</td></tr>
                    <tr><td>Formato:</td><td>${data.formato1080}</td></tr>
                    <tr><td>Resolución:</td><td>${data.resolucion1080}</td></tr>
                    <tr><td>Comprimido:</td><td>${data.comprimido1080}</td></tr>
                    <tr><td>Calidad:</td><td>${data.calidad1080}</td></tr>
                    <tr><td>Tamaño por archivo:</td><td>${data.tamaño1080}</td></tr>
                    <tr><td>Servidores:</td><td>${data.servidores1080}</td></tr>
                    <tr><td>Uploader:</td><td>${data.uploader1080}</td></tr>
                </table>
                <div class="custom-detail__panel">
                    <span id="enlace">${data.contrasena}</span>
                    <br>
                    <a href="${data.enlaces1080}" rel="nofollow" target="_blank">Enlace</a>
                </div>
            </div>
        </div>
    </section>
</main>
`;

    document.getElementById('htmlOutput').value = htmlContent;
    document.getElementById('preview').innerHTML = htmlContent;
    showNotice('HTML generado correctamente.', 'success');
}

export function copyHTML() {
    const htmlOutput = document.getElementById('htmlOutput');
    htmlOutput.select();
    document.execCommand('copy');
    showNotice('HTML copiado al portapapeles.', 'success');
}
