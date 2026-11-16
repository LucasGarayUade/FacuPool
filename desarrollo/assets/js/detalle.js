const parametros = new URLSearchParams(window.location.search);
const viaje = buscarViaje(parametros.get("id"));

const chofer = viaje ? buscarChofer(viaje.choferId) : null;

function completarDetalle() {
    document.title = viaje.origen + " a " + DESTINO + " · FacuPool";
    document.getElementById("titulo-viaje").textContent = "Viaje desde " + viaje.origen;
    document.getElementById("ruta-grande").innerHTML = rutaHTML(viaje.origen);

    const hechos = [
        ["Día y hora", viaje.dia + " " + viaje.hora],
        ["Aporte estimado", formatearPlata(viaje.aporte)],
        ["Lugares libres", viaje.lugares === 0 ? "Completo" : String(viaje.lugares)],
        ["Duración", viaje.duracion + " min"]
    ];
    document.getElementById("hechos").innerHTML = hechos.map(function (h) {
        return '<div class="col-6 col-md-3"><p class="hecho mb-0"><span>' + h[0] + "</span><strong>" + h[1] + "</strong></p></div>";
    }).join("");

    document.getElementById("chofer").innerHTML =
        '<span class="avatar grande" aria-hidden="true">' + iniciales(nombreCompleto(chofer)) + "</span>" +
        "<span><strong>" + escaparHTML(nombreCompleto(chofer)) + '</strong><br><span class="texto-suave">' +
        chofer.facultad + " · " + chofer.anio + " · ★ " + promedioEstrellas(chofer) + " · " + chofer.viajes + " viajes</span></span>";
    document.getElementById("ver-perfil").href = "conductor.html?id=" + chofer.id;

    document.getElementById("punto").textContent = viaje.punto;
    document.getElementById("regla-espera").textContent =
        "El chofer espera " + viaje.espera + " minutos en el punto de encuentro.";
}

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

    mensaje.addEventListener("input", function () {
        contador.textContent = mensaje.value.length;
    });

    if (viaje.lugares === 0) {
        document.getElementById("boton-pedir").disabled = true;
        mostrarEstado('<strong>Este viaje está completo.</strong> <a href="buscar.html?zona=' + encodeURIComponent(viaje.zona) + "&amp;dia=" + encodeURIComponent(viaje.dia) + '">Ver otros viajes del mismo día</a>.', "warning");
        return;
    }

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
            "<strong>Solicitud enviada.</strong> " +
            escaparHTML(nombreCompleto(chofer)) + ' la va a revisar. Te avisamos en <a href="mis-viajes.html">Mis viajes</a>.',
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
