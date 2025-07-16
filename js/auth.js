import { showNotice } from './utils.js';

const CLIENT_ID = '879567119064-pglj8dsqnka2sfpgh6hu50b723f1viia.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/blogger';

let tokenClient;

export function initAuth() {
    if (!window.gapi || !window.google?.accounts) {
        showNotice('Error al cargar las bibliotecas de Google.', 'error');
        return;
    }

    gapi.load('client', async () => {
        try {
            await gapi.client.init({
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/blogger/v3/rest'],
            });
            tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: (tokenResponse) => {
                    if (tokenResponse.access_token) {
                        document.getElementById('authStatus').textContent = 'Autenticado con éxito';
                        document.getElementById('publishButton').disabled = false;
                        showNotice('Autenticación exitosa.', 'success');
                    } else {
                        showNotice('Error en la autenticación.', 'error');
                    }
                },
            });
        } catch (error) {
            showNotice('Error al inicializar el cliente de Google: ' + error.message, 'error');
        }
    });
}

export function handleAuthClick() {
    if (!tokenClient) {
        showNotice('Error: Cliente de autenticación no inicializado.', 'error');
        return;
    }
    tokenClient.requestAccessToken();
}

window.handleAuthClick = handleAuthClick;
