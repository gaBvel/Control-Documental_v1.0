function iniciarInventario(tipo){
    document.getElementById("seleccionInventario").style.display="none";
    document.getElementById("formularioInventario").classList.remove("oculto");
    document.getElementById("tipoSeleccionado").innerHTML=
    "Tipo seleccionado: <b>"+tipo+"</b>";
}

const tipoInventario = document.getElementById("tipoInventario");
const formTramite = document.getElementById("formTramite");
if(tipoInventario){
    tipoInventario.addEventListener("change",function(){
        if(this.value==="tramite"){
            formTramite.hidden = false;
            formTramite.style.display="block";
        }else{
            formTramite.hidden = true;
            formTramite.style.display="none";
        }
    });
}
