const modalDictamen = document.getElementById('modalDictamen');

function cambiarModalDictamen(mostrar) {
    modalDictamen.style.display = mostrar ? 'flex' : 'none';
    modalDictamen.setAttribute('aria-hidden', String(!mostrar));
    if (mostrar) document.getElementById('fechaDictamen').focus();
}

document.querySelectorAll('[data-modal-open="modalDictamen"]').forEach((boton) => boton.addEventListener('click', () => cambiarModalDictamen(true)));
document.querySelectorAll('[data-modal-close="modalDictamen"]').forEach((boton) => boton.addEventListener('click', () => cambiarModalDictamen(false)));
modalDictamen.addEventListener('click', (evento) => { if (evento.target === modalDictamen) cambiarModalDictamen(false); });
document.addEventListener('keydown', (evento) => { if (evento.key === 'Escape') cambiarModalDictamen(false); });
