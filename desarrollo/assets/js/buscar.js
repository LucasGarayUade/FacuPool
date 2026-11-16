const formBuscar = document.getElementById("form-buscar");
const resultados = document.getElementById("resultados");
const cantidad = document.getElementById("cantidad");

function filtrarViajes(todos) {
    const zona = formBuscar.zona.value;
    const localidad = formBuscar.localidad.value;
    const dia = formBuscar.dia.value;
    const franja = formBuscar.franja.value;
    const minimoLugares = Number(formBuscar.lugares.value);
    const orden = formBuscar.orden.value;

    const lista = VIAJES.filter(function (viaje) {
        if (todos) {
            return viaje.lugares >= minimoLugares;
        }
        return viaje.zona === zona &&
            (localidad === "" || viaje.origen === localidad) &&
            viaje.dia === dia &&
            (franja === "" || franjaDeHora(viaje.hora) === franja) &&
            (minimoLugares === 0 || viaje.lugares >= minimoLugares);
    });

    lista.sort(function (a, b) {
        if (orden === "aporte") { return a.aporte - b.aporte; }
        if (orden === "duracion") { return a.duracion - b.duracion; }
        return a.hora.localeCompare(b.hora);
    });

    return lista;
}

function mostrarResultados(todos) {
    const lista = filtrarViajes(todos);
    resultados.innerHTML = "";

    if (lista.length === 0) {
        cantidad.textContent = "No encontramos viajes con esos filtros.";
        resultados.innerHTML =
            '<div class="panel text-center">' +
                '<p class="fw-bold mb-1">No hay viajes para ' + escaparHTML(formBuscar.localidad.value || formBuscar.zona.value) + " el " + escaparHTML(formBuscar.dia.value).toLowerCase() + ".</p>" +
                '<p class="texto-suave">Probá con otro día u otro horario, o publicá tu propio viaje.</p>' +
                '<div class="d-flex flex-wrap justify-content-center gap-2">' +
                    '<button class="btn btn-outline-primary" type="button" id="ver-todos">Ver todos los viajes</button>' +
                    '<a class="btn btn-outline-primary" href="publicar.html">Publicar un viaje</a>' +
                "</div>" +
            "</div>";
        document.getElementById("ver-todos").addEventListener("click", function () {
            mostrarResultados(true);
        });
        return;
    }

    cantidad.textContent = lista.length === 1 ? "Encontramos 1 viaje." : "Encontramos " + lista.length + " viajes.";
    lista.forEach(function (viaje) {
        resultados.appendChild(crearTarjetaViaje(viaje, "detalle.html"));
    });
}

function completarDesdeURL() {
    const parametros = new URLSearchParams(window.location.search);
    ["zona", "dia", "franja", "lugares", "orden"].forEach(function (campo) {
        if (parametros.has(campo)) {
            formBuscar[campo].value = parametros.get(campo);
        }
    });
    formBuscar.localidad.dataset.valor = parametros.get("localidad") || "";
    llenarLocalidades(formBuscar.zona, formBuscar.localidad, "Todas las localidades");

    if (parametros.get("todos") === "1") {
        mostrarResultados(true);
    } else if (formBuscar.zona.value && formBuscar.dia.value) {
        mostrarResultados(false);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    prepararValidacion(formBuscar, function () {
        mostrarResultados(false);
        const datos = new URLSearchParams(new FormData(formBuscar));
        history.replaceState(null, "", "?" + datos.toString());
    });

    ["lugares", "orden"].forEach(function (campo) {
        formBuscar[campo].addEventListener("change", function () {
            if (resultados.children.length) {
                mostrarResultados(!formBuscar.zona.value || !formBuscar.dia.value);
            }
        });
    });

    completarDesdeURL();
});
