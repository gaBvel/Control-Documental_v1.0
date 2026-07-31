document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-file-view]').forEach((control) => {
        const acciones = document.createElement('span');
        acciones.className = 'archivo-acciones';
        acciones.innerHTML = `<a href="${control.dataset.fileView}" target="_blank" rel="noopener" class="archivo-enlace" title="Visualizar archivo" aria-label="Visualizar archivo"><i class="fa-solid fa-eye" aria-hidden="true"></i></a><a href="${control.dataset.fileView}" download class="archivo-enlace" title="Descargar archivo" aria-label="Descargar archivo"><i class="fa-solid fa-download" aria-hidden="true"></i></a>`;
        control.replaceWith(acciones);
    });
});
