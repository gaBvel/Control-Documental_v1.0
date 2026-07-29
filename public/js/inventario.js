const seleccionInventario = document.getElementById('seleccionInventario');
const formularioInventario = document.getElementById('formularioInventario');
const formularioAntesLey = document.getElementById('formularioAntesLey');
const formularioDespuesLey = document.getElementById('formularioDespuesLey');
const tipoSeleccionado = document.getElementById('tipoSeleccionado');
const archivoCsv = document.getElementById('archivoCsv');

function iniciarInventario(tipo) {
    const esDespuesDeLey = tipo === 'Después de la Ley';
    seleccionInventario.hidden = true;
    formularioInventario.classList.remove('oculto');
    formularioAntesLey.classList.toggle('oculto', esDespuesDeLey);
    formularioDespuesLey.classList.toggle('oculto', !esDespuesDeLey);
    tipoSeleccionado.textContent = `Tipo seleccionado: ${tipo}`;
}

document.querySelectorAll('[data-tipo-inventario]').forEach((boton) => {
    boton.addEventListener('click', () => iniciarInventario(boton.dataset.tipoInventario));
});

document.getElementById('cambiarTipo').addEventListener('click', () => {
    formularioInventario.classList.add('oculto');
    seleccionInventario.hidden = false;
    formularioDespuesLey.reset();
});

const tipoInventario = document.getElementById('tipoInventario');
const formTramite = document.getElementById('formTramite');
tipoInventario?.addEventListener('change', function () {
    const mostrarCampos = this.value === 'tramite';
    formTramite.hidden = !mostrarCampos;
    formTramite.style.display = mostrarCampos ? 'grid' : 'none';
});

archivoCsv?.addEventListener('change', function () {
    const archivo = this.files[0];
    if (archivo && !archivo.name.toLowerCase().endsWith('.csv')) {
        this.value = '';
        this.setCustomValidity('Selecciona únicamente un archivo CSV.');
        this.reportValidity();
        return;
    }
    this.setCustomValidity('');
});
