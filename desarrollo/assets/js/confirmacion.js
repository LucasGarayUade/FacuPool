/* Confirmación: datos del viaje aceptado y botón para copiar el teléfono */
document.addEventListener("DOMContentLoaded", function () {
  const parametros = new URLSearchParams(window.location.search);
  const viaje = buscarViaje(parametros.get("id")) || buscarViaje(4);

  document.getElementById("conf-ruta").innerHTML =
    "<span>" + escaparHTML(viaje.origen) + '</span><span class="linea-ruta" aria-hidden="true"></span><span>Facultad</span>';

  document.getElementById("conf-datos").innerHTML =
    '<li><i class="bi bi-calendar-event" aria-hidden="true"></i>' + viaje.dia + " " + viaje.hora + "</li>" +
    '<li><i class="bi bi-geo-alt" aria-hidden="true"></i>' + escaparHTML(viaje.punto) + "</li>" +
    '<li><i class="bi bi-cash-coin" aria-hidden="true"></i>Aporte ' + formatearPlata(viaje.aporte) + "</li>";

  document.getElementById("conf-chofer").textContent = viaje.chofer;
  document.getElementById("conf-espera").textContent =
    "Llegá a horario: el chofer espera " + viaje.espera + " minutos.";

  const botonCopiar = document.getElementById("copiar");
  const mensaje = document.getElementById("copiado");

  botonCopiar.addEventListener("click", function () {
    const telefono = document.getElementById("telefono").textContent;
    // La API del portapapeles solo funciona en https o localhost
    if (navigator.clipboard) {
      navigator.clipboard.writeText(telefono)
        .then(function () { mensaje.textContent = "Teléfono copiado."; })
        .catch(function () { mensaje.textContent = "No se pudo copiar. Anotalo a mano."; });
    } else {
      mensaje.textContent = "Tu navegador no permite copiar. Anotalo a mano.";
    }
  });
});
