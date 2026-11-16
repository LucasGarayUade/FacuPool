document.addEventListener("DOMContentLoaded", function () {
    const contenedor = document.getElementById("viajes-destacados");
    const zonas = Object.keys(ZONAS);

    const destacados = zonas.map(function (zona) {
        return VIAJES.find(function (viaje) {
            return viaje.zona === zona && viaje.lugares > 0;
        });
    });

    contenedor.innerHTML = "";
    destacados.forEach(function (viaje) {
        contenedor.appendChild(crearTarjetaViaje(viaje, "secciones/detalle.html"));
    });
});
