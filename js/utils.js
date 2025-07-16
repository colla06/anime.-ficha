export function showNotice(message, type) {
    const notice = document.createElement('div');
    notice.className = `notice notice-${type}`;
    notice.textContent = message;
    document.body.appendChild(notice);
    setTimeout(() => notice.remove(), 3000);
}

export function initBookmarks() {
    const btnFollow = document.getElementById('btn-follow');
    const btnFavorite = document.getElementById('btn-favorite');
    const btnPlan = document.getElementById('btn-plan');

    const toggleButton = (btn, key) => {
        btn.addEventListener('click', () => {
            const isActive = btn.classList.toggle('following') || btn.classList.toggle('checked');
            localStorage.setItem(key, isActive);
            btn.textContent = isActive ? btn.textContent.replace('Seguir', 'Siguiendo').replace('Favorito', 'Favorited').replace('En Plan', 'Planificado') : btn.textContent.replace('Siguiendo', 'Seguir').replace('Favorited', 'Favorito').replace('Planificado', 'En Plan');
        });
        const savedState = localStorage.getItem(key) === 'true';
        if (savedState) {
            btn.classList.add(btn.textContent.includes('Seguir') ? 'following' : 'checked');
            btn.textContent = btn.textContent.replace('Seguir', 'Siguiendo').replace('Favorito', 'Favorited').replace('En Plan', 'Planificado');
        }
    };

    toggleButton(btnFollow, 'followState');
    toggleButton(btnFavorite, 'favoriteState');
    toggleButton(btnPlan, 'planState');
}
