const SOLICITUDES_EJEMPLO = [
    { id: "e1", viajeId: 2, estado: "aceptada", mensaje: "" },
    { id: "e2", viajeId: 40, estado: "rechazada", mensaje: "" }
];

const VIAJE_PROPIO_EJEMPLO = {
    id: 101, zona: "Zona Oeste", origen: "Castelar", dia: "Miércoles", choferId: USUARIO, hora: "07:30", lugares: 2, aporte: 3300,
    pedidos: [
        { id: "r1", nombre: "Valentina Gómez", perfil: "FADI · 2.º año", mensaje: "Salgo de Morón y puedo caminar hasta la estación." },
        { id: "r2", nombre: "Bruno López", perfil: "FAJU · 3.º año", mensaje: "" }
    ]
};

const TEXTO_ESTADO = { pendiente: "Pendiente", aceptada: "Aceptada", rechazada: "Rechazada" };
const aviso = document.getElementById("aviso-mis-viajes");

function insignia(estado) {
    return '<span class="insignia ' + estado + '">' + TEXTO_ESTADO[estado] + "</span>";
}

function dibujarSolicitudes() {
    const lista = document.getElementById("lista-solicitudes");
    const solicitudes = leerGuardado("solicitudes", []).concat(SOLICITUDES_EJEMPLO);
    lista.innerHTML = "";

    solicitudes.forEach(function (solicitud) {
        const viaje = buscarViaje(solicitud.viajeId);
        if (!viaje) { return; }

        let accion = "";
        if (solicitud.estado === "aceptada") {
            accion = '<a class="btn btn-primary btn-sm" href="confirmacion.html?id=' + viaje.id + '">Ver contacto del chofer</a>';
        } else if (solicitud.estado === "pendiente") {
            accion = '<button class="btn btn-outline-primary btn-sm cancelar" type="button" data-id="' + solicitud.id + '">Cancelar solicitud</button>';
        } else {
            accion = '<a class="btn btn-outline-primary btn-sm" href="buscar.html?zona=' + encodeURIComponent(viaje.zona) + "&amp;dia=" + encodeURIComponent(viaje.dia) + '">Buscar otro viaje</a>';
        }

        const articulo = document.createElement("article");
        articulo.className = "panel d-flex flex-column flex-md-row gap-3 justify-content-between align-items-md-center";
        articulo.innerHTML =
            "<div>" +
                '<h3 class="ruta h6 mb-2">' + rutaHTML(viaje.origen) + '</h3>' +
                '<p class="mb-0 small texto-suave">' + viaje.dia + " " + viaje.hora + " · " + escaparHTML(nombreCompleto(buscarChofer(viaje.choferId))) + " · " + formatearPlata(viaje.aporte) + "</p>" +
            "</div>" +
            '<div class="d-flex flex-wrap align-items-center gap-2">' + insignia(solicitud.estado) + accion + "</div>";
        lista.appendChild(articulo);
    });
}

document.getElementById("lista-solicitudes").addEventListener("click", function (evento) {
    const boton = evento.target.closest(".cancelar");
    if (!boton) { return; }

    const restantes = leerGuardado("solicitudes", []).filter(function (s) {
        return s.id !== boton.dataset.id;
    });
    guardar("solicitudes", restantes);
    dibujarSolicitudes();
    aviso.textContent = "Cancelaste la solicitud.";
});

function tarjetaPedido(pedido, respuestas) {
    const estado = respuestas[pedido.id] || "pendiente";
    const botones = estado === "pendiente"
        ? '<button class="btn btn-primary btn-sm responder" type="button" data-id="' + pedido.id + '" data-respuesta="aceptada">Aceptar<span class="visually-hidden"> a ' + pedido.nombre + "</span></button>" +
            '<button class="btn btn-outline-primary btn-sm responder" type="button" data-id="' + pedido.id + '" data-respuesta="rechazada">Rechazar<span class="visually-hidden"> a ' + pedido.nombre + "</span></button>"
        : "";

    return '<li class="border-top pt-3 d-flex flex-column flex-md-row gap-2 justify-content-between">' +
        '<div class="d-flex gap-2">' +
            '<span class="avatar" aria-hidden="true">' + iniciales(pedido.nombre) + "</span>" +
            "<div><strong>" + pedido.nombre + '</strong> <span class="small texto-suave">' + pedido.perfil + "</span>" +
            (pedido.mensaje ? '<p class="mb-0 small">“' + escaparHTML(pedido.mensaje) + "”</p>" : "") + "</div>" +
        "</div>" +
        '<div class="d-flex flex-wrap align-items-center gap-2">' + insignia(estado) + botones + "</div>" +
    "</li>";
}

function dibujarPublicados() {
    const lista = document.getElementById("lista-publicados");
    const respuestas = leerGuardado("respuestas", {});
    const propios = leerGuardado("publicados", []).map(function (v) {
        v.pedidos = [];
        return v;
    });
    const viajes = propios.concat([VIAJE_PROPIO_EJEMPLO]);
    lista.innerHTML = "";

    viajes.forEach(function (viaje) {
        const pedidos = viaje.pedidos.length
            ? '<ul class="list-unstyled d-grid gap-3 mt-3 mb-0">' + viaje.pedidos.map(function (p) { return tarjetaPedido(p, respuestas); }).join("") + "</ul>"
            : '<p class="small texto-suave mt-3 mb-0">Todavía no hay pedidos de lugar.</p>';

        const articulo = document.createElement("article");
        articulo.className = "panel";
        articulo.innerHTML =
            '<h3 class="ruta h6 mb-2">' + rutaHTML(viaje.origen) + '</h3>' +
            '<p class="mb-0 small texto-suave">' + viaje.dia + " " + viaje.hora + " · " + viaje.lugares + " lugares · " + formatearPlata(viaje.aporte) + "</p>" +
            pedidos;
        lista.appendChild(articulo);
    });
}

document.getElementById("lista-publicados").addEventListener("click", function (evento) {
    const boton = evento.target.closest(".responder");
    if (!boton) { return; }

    const respuestas = leerGuardado("respuestas", {});
    respuestas[boton.dataset.id] = boton.dataset.respuesta;
    guardar("respuestas", respuestas);
    dibujarPublicados();
    aviso.textContent = boton.dataset.respuesta === "aceptada"
        ? "Aceptaste la solicitud. Ahora pueden ver el contacto."
        : "Rechazaste la solicitud.";
});

document.addEventListener("DOMContentLoaded", function () {
    dibujarSolicitudes();
    dibujarPublicados();
});
