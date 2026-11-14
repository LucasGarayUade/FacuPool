/* Perfil: la tarjeta "Así te ven los demás" cambia mientras se edita */
const formPerfil = document.getElementById("form-perfil");

function actualizarVista() {
  const nombre = formPerfil.nombre.value.trim() || "Tu nombre";
  const partes = nombre.split(" ");
  const mostrarApellido = document.getElementById("apellido-completo").checked;
  const mostrarCarrera = document.getElementById("mostrar-carrera").checked;

  // "Nicolás Argüello" -> "Nicolás A." si el apellido completo está oculto
  const visible = partes.length > 1 && !mostrarApellido
    ? partes[0] + " " + partes[1][0] + "."
    : nombre;

  document.getElementById("vista-nombre").textContent = visible;
  document.getElementById("vista-iniciales").textContent = iniciales(visible);
  document.getElementById("vista-carrera").textContent = mostrarCarrera
    ? formPerfil.carrera.value + " · " + formPerfil.anio.value
    : "Prefiere no mostrar carrera y año";
}

document.addEventListener("DOMContentLoaded", function () {
  formPerfil.addEventListener("input", actualizarVista);
  formPerfil.addEventListener("change", actualizarVista);

  prepararValidacion(formPerfil, function () {
    mostrarExito(document.getElementById("exito-perfil"), "<strong>Cambios guardados.</strong> Así te van a ver en tus próximos viajes.");
  });

  actualizarVista();
});
