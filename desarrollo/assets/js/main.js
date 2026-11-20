const CARACTERES_PERMITIDOS = {
    numeros: /[^0-9]/g,
    letras: /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]/g,
    direccion: /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 .,°º-]/g
};

function limpiarCampo(evento) {
    const campo = evento.target;
    const tipo = campo.dataset.solo;
    campo.value = campo.value.replace(CARACTERES_PERMITIDOS[tipo], "");
}

function validarFormulario(evento) {
    evento.preventDefault();
    const formulario = evento.target;

    if (!formulario.checkValidity()) {
        formulario.classList.add("was-validated");
        const primerError = formulario.querySelector("input:invalid, select:invalid, textarea:invalid");
        primerError.focus();
        return;
    }

    formulario.classList.remove("was-validated");
    formulario.reset();

    const mensaje = document.getElementById(formulario.dataset.exito);
    mensaje.classList.remove("d-none");
    mensaje.focus();
}

function mostrarClave(evento) {
    const boton = evento.currentTarget;
    const campo = document.getElementById(boton.dataset.campo);

    if (campo.type === "password") {
        campo.type = "text";
        boton.textContent = "Ocultar";
    } else {
        campo.type = "password";
        boton.textContent = "Mostrar";
    }
}

function filtrarViajes() {
    const origen = document.getElementById("f-origen").value;
    const dia = document.getElementById("f-dia").value;
    const franja = document.getElementById("f-franja").value;
    const tarjetas = document.querySelectorAll("#resultados .tarjeta-viaje");
    let visibles = 0;

    tarjetas.forEach(function (tarjeta) {
        const coincideOrigen = origen === "" || tarjeta.dataset.zona === origen || tarjeta.dataset.localidad === origen;
        const coincideDia = dia === "" || tarjeta.dataset.dia === dia;
        const coincideFranja = franja === "" || tarjeta.dataset.franja === franja;

        if (coincideOrigen && coincideDia && coincideFranja) {
            tarjeta.classList.remove("d-none");
            visibles++;
        } else {
            tarjeta.classList.add("d-none");
        }
    });

    document.getElementById("cantidad").textContent = "Mostrando " + visibles + " de " + tarjetas.length + " viajes.";

    if (visibles === 0) {
        document.getElementById("sin-resultados").classList.remove("d-none");
    } else {
        document.getElementById("sin-resultados").classList.add("d-none");
    }
}

function prepararBuscador(formulario) {
    const parametros = new URLSearchParams(window.location.search);
    document.getElementById("f-origen").value = parametros.get("origen") || "";
    document.getElementById("f-dia").value = parametros.get("dia") || "";

    formulario.addEventListener("change", filtrarViajes);
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        filtrarViajes();
    });

    filtrarViajes();
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-solo]").forEach(function (campo) {
        campo.addEventListener("input", limpiarCampo);
    });

    document.querySelectorAll("form.validar").forEach(function (formulario) {
        formulario.addEventListener("submit", validarFormulario);
    });

    document.querySelectorAll(".ver-clave").forEach(function (boton) {
        boton.addEventListener("click", mostrarClave);
    });

    const buscador = document.getElementById("form-filtro");
    if (buscador) {
        prepararBuscador(buscador);
    }
});
