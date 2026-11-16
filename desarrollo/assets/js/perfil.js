const formPerfil = document.getElementById("form-perfil");

function actualizarVista() {
    const nombre = (formPerfil.nombre.value.trim() + " " + formPerfil.apellido.value.trim()).trim() || "Tu nombre";

    document.getElementById("vista-nombre").textContent = nombre;
    document.getElementById("vista-iniciales").textContent = iniciales(nombre);
    document.getElementById("vista-facultad").textContent = formPerfil.facultad.value + " · " + formPerfil.anio.value;
}

document.addEventListener("DOMContentLoaded", function () {
    formPerfil.addEventListener("input", actualizarVista);
    formPerfil.addEventListener("change", actualizarVista);

    prepararValidacion(formPerfil, function () {
        mostrarExito(document.getElementById("exito-perfil"), "<strong>Cambios guardados.</strong> Así te van a ver en tus próximos viajes.");
    });

    actualizarVista();
});
