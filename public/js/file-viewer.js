document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalVisorArchivo');
    const frame = document.getElementById('visorArchivo');
    const link = document.getElementById('enlaceDescargaArchivo');
    if (!modal || !frame || !link) return;
    const cerrar = () => { modal.style.display = 'none'; modal.setAttribute('aria-hidden', 'true'); frame.removeAttribute('src'); };
    document.querySelectorAll('[data-file-view]').forEach((button) => button.addEventListener('click', () => {
        const url = button.dataset.fileView; frame.src = url; link.href = url;
        modal.style.display = 'flex'; modal.setAttribute('aria-hidden', 'false');
    }));
    document.querySelectorAll('[data-file-close]').forEach((button) => button.addEventListener('click', cerrar));
    modal.addEventListener('click', (event) => { if (event.target === modal) cerrar(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') cerrar(); });
});
