/* =========================================================
   Detalle del viaje: lee el id de la URL (detalle.html?id=3),
   completa la página y maneja el formulario "Pedir un lugar".
   ========================================================= */

const parametros = new URLSearchParams(window.location.search);
const viaje = buscarViaje(parametros.get("id"));

function completarDetalle() {
  document.title = viaje.origen + " a Facultad · FacuPool";
  document.getElementById("titulo-viaje").textContent = "Viaje desde " + viaje.origen;

  document.getElementById("ruta-grande").innerHTML =
    "<span>" + escaparHTML(viaje.origen) + '</span><span class="linea-ruta" aria-hidden="true"></span><span>Facultad</span>';

  const hechos = [
    ["bi-calendar-event", "Día y hora", viaje.dia + " " + viaje.hora],
    ["bi-cash-coin", "Aporte estimado", formatearPlata(viaje.aporte)],
    ["bi-person", "Lugares libres", viaje.lugares === 0 ? "Completo" : String(viaje.lugares)],
    ["bi-clock", "Duración", viaje.duracion + " min"]
  ];
  document.getElementById("hechos").innerHTML = hechos.map(function (h) {
    return '<div class="col-6 col-md-3"><p class="hecho mb-0"><span><i class="bi ' + h[0] + '" aria-hidden="true"></i>' + h[1] + "</span><strong>" + h[2] + "</strong></p></div>";
  }).join("");

  const perfil = viaje.carrera ? viaje.carrera + " · " + viaje.anio : "Prefiere no mostrar carrera y año";
  document.getElementById("chofer").innerHTML =
    '<span class="avatar grande" aria-hidden="true">' + iniciales(viaje.chofer) + "</span>" +
    "<span><strong>" + escaparHTML(viaje.chofer) + '</strong><br><span class="texto-suave">' + escaparHTML(perfil) + "</span></span>";

  document.getElementById("punto").innerHTML =
    '<i class="bi bi-geo-alt-fill text-primary" aria-hidden="true"></i><span>' + escaparHTML(viaje.punto) + "</span>";

  document.getElementById("regla-espera").textContent =
    "El chofer espera " + viaje.espera + " minutos en el punto de encuentro.";
}

/* Reemplaza el formulario por un mensaje (ya pedido, completo o enviado) */
function mostrarEstado(html, tipo) {
  const estado = document.getElementById("estado-solicitud");
  estado.innerHTML = '<div class="alert alert-' + tipo + ' mb-0">' + html + "</div>";
  estado.classList.remove("d-none");
  document.getElementById("form-pedir").classList.add("d-none");
}

function prepararFormulario() {
  const formulario = document.getElementById("form-pedir");
  const mensaje = document.getElementById("mensaje");
  const contador = document.getElementById("contador-mensaje");

  // Contador de caracteres en vivo
  mensaje.addEventListener("input", function () {
    contador.textContent = mensaje.value.length;
  });

  // Viaje sin lugares: botón deshabilitado y explicación
  if (viaje.lugares === 0) {
    document.getElementById("boton-pedir").disabled = true;
    mostrarEstado('<strong>Este viaje está completo.</strong> <a href="buscar.html?zona=' + encodeURIComponent(viaje.zona) + "&amp;dia=" + encodeURIComponent(viaje.dia) + '">Ver otros viajes del mismo día</a>.', "warning");
    return;
  }

  // ¿Ya había pedido lugar en este viaje?
  const solicitudes = leerGuardado("solicitudes", []);
  const previa = solicitudes.find(function (s) { return s.viajeId === viaje.id; });
  if (previa) {
    mostrarEstado('<strong>Ya pediste un lugar en este viaje.</strong> Seguí el estado en <a href="mis-viajes.html">Mis viajes</a>.', "info");
    return;
  }

  prepararValidacion(formulario, function () {
    solicitudes.push({
      id: "s" + Date.now(),
      viajeId: viaje.id,
      estado: "pendiente",
      mensaje: mensaje.value.trim()
    });
    guardar("solicitudes", solicitudes);

    mostrarEstado(
      '<i class="bi bi-check-circle-fill me-1" aria-hidden="true"></i><strong>Solicitud enviada.</strong> ' +
      escaparHTML(viaje.chofer) + ' la va a revisar. Te avisamos en <a href="mis-viajes.html">Mis viajes</a>.',
      "success"
    );
    const estado = document.getElementById("estado-solicitud");
    estado.setAttribute("tabindex", "-1");
    estado.focus();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  if (!viaje) {
    document.getElementById("detalle").classList.add("d-none");
    document.getElementById("viaje-inexistente").classList.remove("d-none");
    return;
  }
  completarDetalle();
  prepararFormulario();
});
