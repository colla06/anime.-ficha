import { showNotice } from './utils.js';

const optionConfigs = {
    fansub720: { storageKey: 'custom_fansub720', defaultOptions: [] },
    encoder720: { storageKey: 'custom_encoder720', defaultOptions: ['Nookcir DOM', 'NatsuZangetsu27'] },
    servidores720: { storageKey: 'custom_servidores720', defaultOptions: ['Mega', 'MediaFire', 'File', 'Index', 'TeraBox'] },
    fansub1080: { storageKey: 'custom_fansub1080', defaultOptions: [] },
    ripper1080: { storageKey: 'custom_ripper1080', defaultOptions: ['VARYG'] },
    raw1080: { storageKey: 'custom_raw1080', defaultOptions: ['DKB Team'] },
    encode1080: { storageKey: 'custom_encode1080', defaultOptions: ['Zero-Anime'] },
    muxeo1080: { storageKey: 'custom_muxeo1080', defaultOptions: ['Colla', 'NatsuZangetsu27', 'Nookcir DOM'] },
    formato1080: { storageKey: 'custom_formato1080', defaultOptions: ['MP4 (x264)', 'MKV (x264)', 'MKV (x265)'] },
    servidores1080: { storageKey: 'custom_servidores1080', defaultOptions: ['Mega', 'MediaFire', 'File', 'Index', 'TeraBox'] }
};

export function initForm() {
    Object.entries(optionConfigs).forEach(([selectId, { storageKey, defaultOptions }]) => {
        loadOptions(selectId, storageKey, defaultOptions);
    });
}

export function loadOptions(selectId, storageKey, defaultOptions = []) {
    const select = document.getElementById(selectId);
    const savedOptions = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const options = [...new Set([...defaultOptions, ...savedOptions])];
    select.innerHTML = options.map(opt => `<option value="${opt}">${opt}</option>`).join('');
}

export function addOption(selectId, inputId, isMultiple = false) {
    const select = document.getElementById(selectId);
    const input = document.getElementById(inputId);
    const newOption = input.value.trim();

    if (!newOption) {
        showNotice('Introduce un valor válido.', 'error');
        return;
    }

    const storageKey = `custom_${selectId}`;
    const savedOptions = JSON.parse(localStorage.getItem(storageKey) || '[]');

    if (!savedOptions.includes(newOption)) {
        savedOptions.push(newOption);
        localStorage.setItem(storageKey, JSON.stringify(savedOptions));
        const optionElement = document.createElement('option');
        optionElement.value = newOption;
        optionElement.textContent = newOption;
        select.appendChild(optionElement);
        if (isMultiple) {
            optionElement.selected = true;
        } else {
            select.value = newOption;
        }
        showNotice('Opción añadida correctamente.', 'success');
    } else {
        showNotice('La opción ya existe.', 'error');
    }
    input.value = '';
}

export async function selectAnime(anime) {
    try {
        document.getElementById('tituloPrincipal').value = anime.title || '';
        document.getElementById('tituloAlternativo').value = anime.title_english || anime.title_japanese || (anime.titles?.find(t => t.type === 'Synonym')?.title) || '';
        document.getElementById('estudio').value = anime.studios?.map(s => s.name).join(', ') || 'Desconocido';
        document.getElementById('urlPortada').value = anime.images?.jpg?.large_image_url || '';
        document.getElementById('urlMyAnimeList').value = anime.url || '';
        document.getElementById('urlAniList').value = anime.url ? `https://anilist.co/anime/${document.getElementById('searchQuery').value}` : '';
        document.getElementById('duracion').value = anime.duration || '';
        document.getElementById('temporadaEstacion').value = anime.season ? anime.season.toLowerCase() : '';
        document.getElementById('temporadaAño').value = anime.year || '';
        document.getElementById('episodios').value = anime.episodes ? `${anime.episodes}/${anime.episodes}` : '';
        document.getElementById('estado').value = anime.status === 'Currently Airing' ? 'En emisión' : anime.status === 'Not yet aired' ? 'Próximamente' : 'Finalizado';
        document.getElementById('trailerUrl').value = anime.trailer?.youtube_id ? `https://www.youtube.com/watch?v=${anime.trailer.youtube_id}` : '';

        const tags = anime.genres?.map(g => g.name.toLowerCase()) || [];
        if (anime.season && anime.year) {
            const seasonTag = `${anime.year} ${anime.season.toLowerCase()}`;
            if (['2025 verano', '2025 otoño', '2025 invierno', '2025 primavera'].includes(seasonTag)) {
                tags.push(seasonTag);
            }
        }
        const selectTags = document.getElementById('tags');
        Array.from(selectTags.options).forEach(option => {
            option.selected = tags.includes(option.value);
        });

        let synopsis = anime.synopsis || 'Sin sinopsis disponible.';
        try {
            const response = await fetch('https://graphql.anilist.co', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
                        query ($idMal: Int) {
                            Media(idMal: $idMal, type: ANIME) {
                                description(asHtml: false)
                            }
                        }
                    `,
                    variables: { idMal: parseInt(document.getElementById('searchQuery').value) }
                })
            });
            const { data } = await response.json();
            synopsis = data?.Media?.description?.replace(/<[^>]+>/g, '') || `Por favor, traduce manualmente: "${synopsis}"`;
        } catch (error) {
            synopsis = `Por favor, traduce manualmente: "${synopsis}"`;
        }
        document.getElementById('sinopsis').value = synopsis;

        showNotice('Datos del anime cargados correctamente.', 'success');
    } catch (error) {
        showNotice('Error al cargar los datos: ' + error.message, 'error');
    }
}

export function parsePostContent(post) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, 'text/html');

    document.getElementById('tituloPrincipal').value = doc.querySelector('.titles--main')?.textContent || post.title || '';
    document.getElementById('tituloAlternativo').value = doc.querySelector('.titles--alt')?.textContent || '';
    document.getElementById('urlPortada').value = doc.querySelector('.anime-info__cover img')?.src || '';
    document.getElementById('estudio').value = doc.querySelector('.misc__studios span')?.textContent || '';
    document.getElementById('urlMyAnimeList').value = doc.querySelector('.misc__links a[href*="myanimelist.net"]')?.href || '';
    document.getElementById('urlAniList').value = doc.querySelector('.misc__links a[href*="anilist.co"]')?.href || '';
    document.getElementById('sinopsis').value = doc.querySelector('.synopsis__content')?.textContent.replace('<!--more-->', '') || '';
    document.getElementById('estado').value = doc.querySelector('.airing-status')?.textContent.replace('ESTADO:', '').trim() || 'Finalizado';
    document.getElementById('proxEpisodio').value = doc.querySelector('.airing-status span:nth-child(2)')?.textContent.replace('PRÓX. EPISODIO:', '').trim() || '';
    document.getElementById('duracion').value = doc.querySelector('#duration')?.textContent.replace('Duración:', '').trim() || '';
    const seasonLink = doc.querySelector('.season a')?.href.match(/\/search\/label\/(\d+)%20(\w+)/);
    if (seasonLink) {
        document.getElementById('temporadaAño').value = seasonLink[1];
        document.getElementById('temporadaEstacion').value = seasonLink[2].toLowerCase();
    }
    document.getElementById('tipo').value = doc.querySelector('#format')?.textContent.replace('Tipo:', '').trim() || 'WEBrip';
    document.getElementById('episodios').value = doc.querySelector('.content__details span b')?.textContent || '';
    document.getElementById('trailerUrl').value = doc.querySelector('.anime-related a[href*="youtube.com"]')?.href || '';
    document.getElementById('videoIframe').value = doc.querySelector('.video-display iframe')?.src || '';
    document.getElementById('contrasena').value = doc.querySelector('#enlace')?.textContent || 'animeyseriesdo';

    const tags = Array.from(doc.querySelectorAll('.anime-tags span a')).map(a =>
        a.textContent.toLowerCase().replace(/2025 (\w+)/, (match, season) => `2025 ${season.toLowerCase()}`)
    );
    const selectTags = document.getElementById('tags');
    Array.from(selectTags.options).forEach(option => {
        option.selected = tags.includes(option.value);
    });

    const table720 = doc.querySelector('.tab__panel#panel--1 .tab-custom-table');
    if (table720) {
        const fansub720 = table720.querySelector('tr:nth-child(1) td')?.textContent || '';
        const selectFansub720 = document.getElementById('fansub720');
        if (fansub720 && !Array.from(selectFansub720.options).some(opt => opt.value === fansub720)) {
            const savedFansub720 = JSON.parse(localStorage.getItem('custom_fansub720') || '[]');
            savedFansub720.push(fansub720);
            localStorage.setItem('custom_fansub720', JSON.stringify([...new Set(savedFansub720)]));
            loadOptions('fansub720', 'custom_fansub720');
        }
        selectFansub720.value = fansub720;

        const subtitulos720 = table720.querySelector('tr:nth-child(2) td')?.textContent.split(', ') || [];
        Array.from(document.getElementById('subtitulos720').options).forEach(option => {
            option.selected = subtitulos720.includes(option.value);
        });

        const idioma720 = table720.querySelector('tr:nth-child(3) td')?.textContent.split(', ') || [];
        Array.from(document.getElementById('idioma720').options).forEach(option => {
            option.selected = idioma720.includes(option.value);
        });

        const encoder720 = table720.querySelector('tr:nth-child(4) td')?.textContent || '';
        const selectEncoder720 = document.getElementById('encoder720');
        if (encoder720 && !Array.from(selectEncoder720.options).some(opt => opt.value === encoder720)) {
            const savedEncoder720 = JSON.parse(localStorage.getItem('custom_encoder720') || '[]');
            savedEncoder720.push(encoder720);
            localStorage.setItem('custom_encoder720', JSON.stringify([...new Set(savedEncoder720)]));
            loadOptions('encoder720', 'custom_encoder720', ['Nookcir DOM', 'NatsuZangetsu27']);
        }
        selectEncoder720.value = encoder720;

        document.getElementById('tamaño720').value = table720.querySelector('tr:nth-child(9) td')?.textContent || '';

        const servidores720 = table720.querySelector('tr:nth-child(10) td')?.textContent.split(', ') || [];
        const selectServidores720 = document.getElementById('servidores720');
        const savedServidores720 = JSON.parse(localStorage.getItem('custom_servidores720') || '[]');
        servidores720.forEach(serv => {
            if (!Array.from(selectServidores720.options).some(opt => opt.value === serv)) {
                savedServidores720.push(serv);
            }
        });
        localStorage.setItem('custom_servidores720', JSON.stringify([...new Set(savedServidores720)]));
        loadOptions('servidores720', 'custom_servidores720', ['Mega', 'MediaFire', 'File', 'Index', 'TeraBox']);
        Array.from(selectServidores720.options).forEach(option => {
            option.selected = servidores720.includes(option.value);
        });

        document.getElementById('uploader720').value = table720.querySelector('tr:nth-child(11) td')?.textContent || '';
        document.getElementById('enlaces720').value = table720.querySelector('.custom-detail__panel a[href*="pastebin.com"]')?.href || '';
    }

    const table1080 = doc.querySelector('.tab__panel#panel--2 .tab-custom-table');
    if (table1080) {
        const fansub1080 = table1080.querySelector('tr:nth-child(1) td')?.textContent || '';
        const selectFansub1080 = document.getElementById('fansub1080');
        if (fansub1080 && !Array.from(selectFansub1080.options).some(opt => opt.value === fansub1080)) {
            const savedFansub1080 = JSON.parse(localStorage.getItem('custom_fansub1080') || '[]');
            savedFansub1080.push(fansub1080);
            localStorage.setItem('custom_fansub1080', JSON.stringify([...new Set(savedFansub1080)]));
            loadOptions('fansub1080', 'custom_fansub1080');
        }
        selectFansub1080.value = fansub1080;

        const subtitulos1080 = table1080.querySelector('tr:nth-child(2) td')?.textContent.split(', ') || [];
        Array.from(document.getElementById('subtitulos1080').options).forEach(option => {
            option.selected = subtitulos1080.includes(option.value);
        });

        const idioma1080 = table1080.querySelector('tr:nth-child(3) td')?.textContent.split(', ') || [];
        Array.from(document.getElementById('idioma1080').options).forEach(option => {
            option.selected = idioma1080.includes(option.value);
        });

        const ripper1080 = table1080.querySelector('tr:nth-child(4) td')?.textContent || '';
        const selectRipper1080 = document.getElementById('ripper1080');
        if (ripper1080 && !Array.from(selectRipper1080.options).some(opt => opt.value === ripper1080)) {
            const savedRipper1080 = JSON.parse(localStorage.getItem('custom_ripper1080') || '[]');
            savedRipper1080.push(ripper1080);
            localStorage.setItem('custom_ripper1080', JSON.stringify([...new Set(savedRipper1080)]));
            loadOptions('ripper1080', 'custom_ripper1080', ['VARYG']);
        }
        selectRipper1080.value = ripper1080;

        const rawEncode1080 = table1080.querySelector('tr:nth-child(5) td')?.textContent || '';
        const [raw1080, encode1080] = rawEncode1080.split('/').map(s => s.trim());
        const selectRaw1080 = document.getElementById('raw1080');
        if (raw1080 && !Array.from(selectRaw1080.options).some(opt => opt.value === raw1080)) {
            const savedRaw1080 = JSON.parse(localStorage.getItem('custom_raw1080') || '[]');
            savedRaw1080.push(raw1080);
            localStorage.setItem('custom_raw1080', JSON.stringify([...new Set(savedRaw1080)]));
            loadOptions('raw1080', 'custom_raw1080', ['DKB Team']);
        }
        selectRaw1080.value = raw1080 || '';

        const selectEncode1080 = document.getElementById('encode1080');
        if (encode1080 && !Array.from(selectEncode1080.options).some(opt => opt.value === encode1080)) {
            const savedEncode1080 = JSON.parse(localStorage.getItem('custom_encode1080') || '[]');
            savedEncode1080.push(encode1080);
            localStorage.setItem('custom_encode1080', JSON.stringify([...new Set(savedEncode1080)]));
            loadOptions('encode1080', 'custom_encode1080', ['Zero-Anime']);
        }
        selectEncode1080.value = encode1080 || '';

        const muxeo1080 = table1080.querySelector('tr:nth-child(6) td')?.textContent || '';
        const selectMuxeo1080 = document.getElementById('muxeo1080');
        if (muxeo1080 && !Array.from(selectMuxeo1080.options).some(opt => opt.value === muxeo1080)) {
            const savedMuxeo1080 = JSON.parse(localStorage.getItem('custom_muxeo1080') || '[]');
            savedMuxeo1080.push(muxeo1080);
            localStorage.setItem('custom_muxeo1080', JSON.stringify([...new Set(savedMuxeo1080)]));
            loadOptions('muxeo1080', 'custom_muxeo1080', ['Colla', 'NatsuZangetsu27', 'Nookcir DOM']);
        }
        selectMuxeo1080.value = muxeo1080;

        const formato1080 = table1080.querySelector('tr:nth-child(7) td')?.textContent || '';
        const selectFormato1080 = document.getElementById('formato1080');
        if (formato1080 && !Array.from(selectFormato1080.options).some(opt => opt.value === formato1080)) {
            const savedFormato1080 = JSON.parse(localStorage.getItem('custom_formato1080') || '[]');
            savedFormato1080.push(formato1080);
            localStorage.setItem('custom_formato1080', JSON.stringify([...new Set(savedFormato1080)]));
            loadOptions('formato1080', 'custom_formato1080', ['MP4 (x264)', 'MKV (x264)', 'MKV (x265)']);
        }
        selectFormato1080.value = formato1080;

        document.getElementById('tamaño1080').value = table1080.querySelector('tr:nth-child(11) td')?.textContent || '';

        const servidores1080 = table1080.querySelector('tr:nth-child(12) td')?.textContent.split(', ') || [];
        const selectServidores1080 = document.getElementById('servidores1080');
        const savedServidores1080 = JSON.parse(localStorage.getItem('custom_servidores1080') || '[]');
        servidores1080.forEach(serv => {
            if (!Array.from(selectServidores1080.options).some(opt => opt.value === serv)) {
                savedServidores1080.push(serv);
            }
        });
        localStorage.setItem('custom_servidores1080', JSON.stringify([...new Set(savedServidores1080)]));
        loadOptions('servidores1080', 'custom_servidores1080', ['Mega', 'MediaFire', 'File', 'Index', 'TeraBox']);
        Array.from(selectServidores1080.options).forEach(option => {
            option.selected = servidores1080.includes(option.value);
        });

        document.getElementById('uploader1080').value = table1080.querySelector('tr:nth-child(13) td')?.textContent || '';
        document.getElementById('enlaces1080').value = table1080.querySelector('.custom-detail__panel a[href*="pastebin.com"]')?.href || '';
    }
}
