import { initAuth } from './auth.js';
import { searchAnime, loadPost, publishPost } from './api.js';
import { initForm, addOption } from './form.js';
import { generateHTML, copyHTML } from './htmlGenerator.js';
import { initBookmarks, initThemeToggle, showLoader } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initForm();
    initBookmarks();
    initThemeToggle();

    document.getElementById('authButton').addEventListener('click', () => {
        showLoader(true);
        window.handleAuthClick();
    });
    document.getElementById('searchButton').addEventListener('click', () => {
        showLoader(true);
        searchAnime().finally(() => showLoader(false));
    });
    document.getElementById('loadPostButton').addEventListener('click', () => {
        showLoader(true);
        loadPost().finally(() => showLoader(false));
    });
    document.getElementById('publishButton').addEventListener('click', () => {
        showLoader(true);
        publishPost().finally(() => showLoader(false));
    });

    window.addOption = addOption;
    window.generateHTML = generateHTML;
    window.copyHTML = copyHTML;
});
