const modalDictamen = document.getElementById('modalDictamen');
const formDictamen = document.getElementById('formDictamen');
const tablaDictamenes = document.getElementById('tablaDictamenes');
const contadorDictamenes = document.getElementById('contadorDictamenes');
let totalDictamenes = 0;

function cambiarModalDictamen(mostrar) {
    modalDictamen.style.display = mostrar ? 'flex' : 'none';
    modalDictamen.setAttribute('aria-hidden', String(!mostrar));
    if (mostrar) document.getElementById('fechaDictamen').focus();
}

document.querySelectorAll('[data-modal-open="modalDictamen"]').forEach((boton) => {
    boton.addEventListener('click', () => cambiarModalDictamen(true));
});

document.querySelectorAll('[data-modal-close="modalDictamen"]').forEach((boton) => {
    boton.addEventListener('click', () => cambiarModalDictamen(false));
});

modalDictamen.addEventListener('click', (evento) => {
    if (evento.target === modalDictamen) cambiarModalDictamen(false);
});

document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && modalDictamen.style.display === 'flex') cambiarModalDictamen(false);
});

formDictamen.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const fecha = document.getElementById('fechaDictamen').value;
    const archivo = document.getElementById('archivoDictamen').files[0];
    const tipo = document.getElementById('tipoDictamen').value;
    if (!fecha || !archivo || !tipo) return;

    tablaDictamenes.querySelector('.fila-vacia')?.remove();
    const fila = document.createElement('tr');
    const fechaFormateada = new Intl.DateTimeFormat('es-MX', { dateStyle: 'long' }).format(new Date(`${fecha}T00:00:00`));
    const valores = [fechaFormateada, archivo.name, tipo, 'Sin archivo', 'Sin evidencia', 'Sin observaciones'];
    valores.forEach((valor, indice) => {
        const celda = document.createElement('td');
        if (indice === 1) {
            const icono = document.createElement('i');
            icono.className = 'fa-solid fa-file-lines';
            celda.append(icono, document.createTextNode(` ${valor}`));
        } else if (indice === 2) {
            const etiqueta = document.createElement('span');
            etiqueta.className = 'pendiente';
            etiqueta.textContent = valor;
            celda.append(etiqueta);
        } else {
            celda.textContent = valor;
        }
        fila.append(celda);
    });
    tablaDictamenes.prepend(fila);
    totalDictamenes += 1;
    contadorDictamenes.textContent = `${totalDictamenes} ${totalDictamenes === 1 ? 'registro' : 'registros'}`;
    formDictamen.reset();
    cambiarModalDictamen(false);
});
