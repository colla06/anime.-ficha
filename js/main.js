import { initAuth } from './auth.js';
import { searchAnime, loadPost, publishPost } from './api.js';
import { initForm, addOption } from './form.js';
import { generateHTML, copyHTML } from './htmlGenerator.js';
import { initBookmarks } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initForm();
    initBookmarks();

    document.getElementById('authButton').addEventListener('click', window.handleAuthClick);
    document.getElementById('searchButton').addEventListener('click', searchAnime);
    document.getElementById('loadPostButton').addEventListener('click', loadPost);
    document.getElementById('publishButton').addEventListener('click', publishPost);

    window.addOption = addOption;
    window.generateHTML = generateHTML;
    window.copyHTML = copyHTML;
});
