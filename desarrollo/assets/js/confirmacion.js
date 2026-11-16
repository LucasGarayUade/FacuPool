document.addEventListener("DOMContentLoaded", function () {
    const parametros = new URLSearchParams(window.location.search);
    const viaje = buscarViaje(parametros.get("id")) || VIAJES[0];
    const chofer = buscarChofer(viaje.choferId);

    document.getElementById("conf-ruta").innerHTML = rutaHTML(viaje.origen);

    document.getElementById("conf-datos").innerHTML =
        "<li>" + viaje.dia + " " + viaje.hora + "</li>" +
        "<li>Sale desde " + escaparHTML(viaje.origen) + "</li>" +
        "<li>Aporte " + formatearPlata(viaje.aporte) + "</li>";

    document.getElementById("conf-chofer").textContent = nombreCompleto(chofer);
    document.getElementById("conf-perfil").href = "conductor.html?id=" + chofer.id;
    document.getElementById("conf-espera").textContent =
        "Llegá a horario: el chofer espera " + viaje.espera + " minutos.";

    const botonCopiar = document.getElementById("copiar");
    const mensaje = document.getElementById("copiado");

    botonCopiar.addEventListener("click", function () {
        const telefono = document.getElementById("telefono").textContent;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(telefono)
                .then(function () { mensaje.textContent = "Teléfono copiado."; })
                .catch(function () { mensaje.textContent = "No se pudo copiar. Anotalo a mano."; });
        } else {
            mensaje.textContent = "Tu navegador no permite copiar. Anotalo a mano.";
        }
    });
});
