document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('[data-sidebar]');
    const toggles = document.querySelectorAll('[data-sidebar-toggle]');
    if (!sidebar || !toggles.length) return;

    const STORAGE_KEY = 'scd_sidebar';
    const MOBILE_WIDTH = 992;
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    const isMobile = () => window.innerWidth <= MOBILE_WIDTH;

    function actualizarControl() {
        const contraida = sidebar.classList.contains('collapsed');
        toggles.forEach((toggle) => {
            const esMovil = toggle.classList.contains('sidebar-mobile-toggle');
            toggle.setAttribute('aria-expanded', esMovil ? String(sidebar.classList.contains('show')) : String(!contraida));
            toggle.setAttribute('aria-label', esMovil ? (sidebar.classList.contains('show') ? 'Cerrar barra lateral' : 'Abrir barra lateral') : (contraida ? 'Expandir barra lateral' : 'Contraer barra lateral'));
            if (!esMovil) {
                toggle.setAttribute('title', contraida ? 'Expandir barra lateral' : 'Contraer barra lateral');
                toggle.querySelector('i').className = contraida ? 'fa-solid fa-angle-right' : 'fa-solid fa-angle-left';
            }
        });
    }

    function cerrarMovil() {
        sidebar.classList.remove('show');
        overlay.classList.remove('active');
        actualizarControl();
    }

    function cargarEstado() {
        if (isMobile()) {
            sidebar.classList.remove('collapsed');
            cerrarMovil();
        } else {
            sidebar.classList.toggle('collapsed', localStorage.getItem(STORAGE_KEY) === 'collapsed');
            cerrarMovil();
        }
        actualizarControl();
    }

    toggles.forEach((toggle) => toggle.addEventListener('click', () => {
        if (isMobile()) {
            sidebar.classList.toggle('show');
            overlay.classList.toggle('active');
            actualizarControl();
            return;
        }

        if (toggle.classList.contains('sidebar-mobile-toggle')) return;
        sidebar.classList.toggle('collapsed');
        localStorage.setItem(STORAGE_KEY, sidebar.classList.contains('collapsed') ? 'collapsed' : 'expanded');
        actualizarControl();
    }));

    overlay.addEventListener('click', cerrarMovil);
    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape' && isMobile()) cerrarMovil();
    });
    window.addEventListener('resize', cargarEstado);
    document.querySelectorAll('.menu-item').forEach((enlace) => enlace.addEventListener('click', () => {
        if (isMobile()) cerrarMovil();
    }));

    const encabezado = document.querySelector('.contenido > header');
    const controlEscritorio = document.querySelector('.sidebar-toggle');
    if (encabezado && controlEscritorio) encabezado.prepend(controlEscritorio);

    const modalLogout = document.getElementById('modalCerrarSesion');
    const mostrarLogout = () => { modalLogout.style.display = 'flex'; modalLogout.setAttribute('aria-hidden', 'false'); };
    const cerrarLogout = () => { modalLogout.style.display = 'none'; modalLogout.setAttribute('aria-hidden', 'true'); };
    document.querySelectorAll('[data-logout-open]').forEach((boton) => boton.addEventListener('click', mostrarLogout));
    document.querySelectorAll('[data-logout-close]').forEach((boton) => boton.addEventListener('click', cerrarLogout));
    modalLogout?.addEventListener('click', (evento) => { if (evento.target === modalLogout) cerrarLogout(); });

    cargarEstado();
});
