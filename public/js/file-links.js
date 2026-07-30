document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-file-view]').forEach((control) => {
        const enlace = document.createElement('a');
        enlace.href = control.dataset.fileView;
        enlace.target = '_blank';
        enlace.rel = 'noopener';
        enlace.className = 'archivo-enlace';
        enlace.innerHTML = '<i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i><span>Ver archivo</span>';
        control.replaceWith(enlace);
    });
});
