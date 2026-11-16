function estrellas(cantidad) {
    return "★★★★★".slice(0, cantidad) + "☆☆☆☆☆".slice(0, 5 - cantidad);
}

document.addEventListener("DOMContentLoaded", function () {
    const parametros = new URLSearchParams(window.location.search);
    const chofer = buscarChofer(parametros.get("id"));

    if (!chofer) {
        document.getElementById("perfil-conductor").classList.add("d-none");
        document.getElementById("conductor-inexistente").classList.remove("d-none");
        return;
    }

    const nombre = nombreCompleto(chofer);
    document.title = nombre + " · FacuPool";
    document.getElementById("titulo-conductor").textContent = nombre;
    document.getElementById("c-iniciales").textContent = iniciales(nombre);
    document.getElementById("c-facultad").textContent = chofer.facultad + " · " + chofer.anio;
    document.getElementById("c-desde").textContent = "En FacuPool desde " + chofer.desde;
    document.getElementById("c-viajes").textContent = chofer.viajes;
    document.getElementById("c-promedio").textContent = "★ " + promedioEstrellas(chofer);
    document.getElementById("c-cantidad").textContent = chofer.resenas.length;

    document.getElementById("c-resenas").innerHTML = chofer.resenas.map(function (r) {
        return '<li class="panel">' +
            '<p class="mb-1"><span class="estrellas" aria-label="' + r.estrellas + ' de 5 estrellas">' + estrellas(r.estrellas) + "</span> <strong>" + escaparHTML(r.autor) + "</strong></p>" +
            '<p class="mb-0">' + escaparHTML(r.texto) + "</p></li>";
    }).join("");

    const proximos = VIAJES.filter(function (v) { return v.choferId === chofer.id; }).slice(0, 4);
    const lista = document.getElementById("c-proximos");
    if (proximos.length === 0) {
        lista.innerHTML = '<p class="texto-suave">No tiene viajes publicados por ahora.</p>';
    } else {
        proximos.forEach(function (viaje) {
            lista.appendChild(crearTarjetaViaje(viaje, "detalle.html"));
        });
    }
});
