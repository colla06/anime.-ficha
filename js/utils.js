export function showNotice(message, type) {
    const notice = document.createElement('div');
    notice.className = `notice notice-${type}`;
    notice.textContent = message;
    document.body.appendChild(notice);
    setTimeout(() => notice.remove(), 3000);
}

export function showLoader(show = true) {
    document.getElementById('loader').classList.toggle('hidden', !show);
}

export function initBookmarks() {
    const btnFollow = document.getElementById('btn-follow');
    const btnFavorite = document.getElementById('btn-favorite');
    const btnPlan = document.getElementById('btn-plan');

    const toggleButton = (btn, key) => {
        btn.addEventListener('click', () => {
            const isActive = btn.classList.toggle('following') || btn.classList.toggle('checked');
            localStorage.setItem(key, isActive);
            btn.innerHTML = isActive
                ? btn.innerHTML.replace('Seguir', 'Siguiendo').replace('Favorito', 'Favorited').replace('En Plan', 'Planificado')
                : btn.innerHTML.replace('Siguiendo', 'Seguir').replace('Favorited', 'Favorito').replace('Planificado', 'En Plan');
        });
        const savedState = localStorage.getItem(key) === 'true';
        if (savedState) {
            btn.classList.add(btn.innerHTML.includes('Seguir') ? 'following' : 'checked');
            btn.innerHTML = btn.innerHTML.replace('Seguir', 'Siguiendo').replace('Favorito', 'Favorited').replace('En Plan', 'Planificado');
        }
    };

    toggleButton(btnFollow, 'followState');
    toggleButton(btnFavorite, 'favoriteState');
    toggleButton(btnPlan, 'planState');
}

export function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        themeToggle.innerHTML = html.classList.contains('dark')
            ? '<i class="fas fa-moon"></i>'
            : '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    });

    if (localStorage.getItem('theme') === 'light') {
        html.classList.remove('dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}
