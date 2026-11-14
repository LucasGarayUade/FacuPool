/* Inicio: muestra los tres próximos viajes con lugares libres */
document.addEventListener("DOMContentLoaded", function () {
  const contenedor = document.getElementById("viajes-destacados");

  const disponibles = VIAJES
    .filter(function (viaje) { return viaje.lugares > 0; })
    .slice(0, 3);

  contenedor.innerHTML = ""; // saca el texto "Cargando viajes…"
  disponibles.forEach(function (viaje) {
    contenedor.appendChild(crearTarjetaViaje(viaje, "secciones/detalle.html"));
  });
});
