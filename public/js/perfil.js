
const modal=document.getElementById("modalPerfil");
document.getElementById("abrirPerfil").onclick=()=>{
    modal.style.display="flex";
}

document.getElementById("cerrarPerfil").onclick=()=>{
    modal.style.display="none";
}

document.getElementById("btnCerrarPerfil").onclick=()=>{
    modal.style.display="none";
}

window.onclick=(e)=>{
    if(e.target==modal){
        modal.style.display="none";
    }
}