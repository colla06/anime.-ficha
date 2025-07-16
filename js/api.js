import { showNotice, showLoader } from './utils.js';
import { selectAnime, parsePostContent } from './form.js';

export async function searchAnime() {
    const query = document.getElementById('searchQuery').value.trim();
    if (!query || isNaN(query)) {
        showNotice('Introduce un ID numérico válido de MyAnimeList.', 'error');
        showLoader(false);
        return;
    }

    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${query}/full`);
        if (response.status === 429) {
            showNotice('Límite de solicitudes alcanzado. Espera un momento.', 'error');
            showLoader(false);
            return;
        }
        if (!response.ok) {
            showNotice('No se encontró un anime con ese ID.', 'error');
            showLoader(false);
            return;
        }
        const { data: anime } = await response.json();
        await selectAnime(anime);
    } catch (error) {
        showNotice('Error al buscar en MyAnimeList: ' + error.message, 'error');
    } finally {
        showLoader(false);
    }
}

export async function loadPost() {
    const blogId = document.getElementById('blogId').value.trim();
    const postId = document.getElementById('postId').value.trim();
    if (!blogId || !postId) {
        showNotice('Introduce el ID del blog y de la entrada.', 'error');
        showLoader(false);
        return;
    }

    try {
        const response = await gapi.client.blogger.posts.get({ blogId, postId });
        parsePostContent(response.result);
        showNotice('Entrada cargada correctamente.', 'success');
    } catch (error) {
        showNotice(`Error al cargar la entrada: ${error.result?.error?.message || error.message}`, 'error');
    } finally {
        showLoader(false);
    }
}

export async function publishPost() {
    const blogId = document.getElementById('blogId').value.trim();
    const postId = document.getElementById('postId').value.trim();
    const publishStatus = document.getElementById('publishStatus').value;
    const htmlContent = document.getElementById('htmlOutput').value;

    if (!blogId) {
        showNotice('Introduce el ID del blog.', 'error');
        showLoader(false);
        return;
    }
    if (!htmlContent) {
        showNotice('Genera el HTML primero.', 'error');
        showLoader(false);
        return;
    }

    const postData = {
        title: document.getElementById('tituloPrincipal').value,
        content: htmlContent,
        labels: Array.from(document.getElementById('tags').selectedOptions).map(option => {
            if (['2025 verano', '2025 otoño', '2025 invierno', '2025 primavera'].includes(option.value)) {
                return option.value.replace(/(\d{4}) (\w+)/, (match, year, season) =>
                    `${year} ${season.charAt(0).toUpperCase() + season.slice(1)}`
                );
            }
            return option.value;
        }),
        status: publishStatus
    };

    try {
        const response = postId
            ? await gapi.client.blogger.posts.patch({ blogId, postId, resource: postData })
            : await gapi.client.blogger.posts.insert({ blogId, resource: postData });
        showNotice(`Entrada ${postId ? 'actualizada' : 'publicada'} con éxito: ${response.result.url}`, 'success');
        document.getElementById('postId').value = response.result.id;
    } catch (error) {
        showNotice(`Error al publicar la entrada: ${error.result?.error?.message || error.message}`, 'error');
    } finally {
        showLoader(false);
    }
}
