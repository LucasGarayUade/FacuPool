function prepararValidacion(formulario, alEnviarBien) {
    formulario.setAttribute("novalidate", "");

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const resumen = formulario.querySelector(".resumen-errores");

        if (!formulario.checkValidity()) {
            formulario.classList.add("was-validated");

            const invalidos = formulario.querySelectorAll("input:invalid, select:invalid, textarea:invalid");
            if (resumen) {
                resumen.textContent = invalidos.length === 1
                    ? "Revisá 1 campo marcado en rojo."
                    : "Revisá los " + invalidos.length + " campos marcados en rojo.";
                resumen.classList.remove("d-none");
            }
            if (invalidos.length) {
                invalidos[0].focus();
            }
            return;
        }

        if (resumen) {
            resumen.classList.add("d-none");
        }
        formulario.classList.remove("was-validated");
        alEnviarBien(formulario);
    });
}

function mostrarExito(contenedor, mensajeHTML) {
    contenedor.innerHTML = '<div class="alert alert-success mb-0" role="alert">' + mensajeHTML + "</div>";
    contenedor.classList.remove("d-none");
    contenedor.setAttribute("tabindex", "-1");
    contenedor.focus();
}

const CARACTERES_PERMITIDOS = {
    numeros: /[^0-9]/g,
    letras: /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]/g,
    direccion: /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 .,°º-]/g
};

function limpiarCampo(campo) {
    const limpio = campo.value.replace(CARACTERES_PERMITIDOS[campo.dataset.solo], "");
    if (limpio !== campo.value) {
        campo.value = limpio;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-solo]").forEach(function (campo) {
        campo.addEventListener("input", function () {
            limpiarCampo(campo);
        });
    });

    const anio = document.getElementById("anio");
    if (anio) {
        anio.textContent = new Date().getFullYear();
    }

    document.querySelectorAll("select[data-zona]").forEach(function (selectLocalidad) {
        const selectZona = document.getElementById(selectLocalidad.dataset.zona);
        const textoVacio = selectLocalidad.dataset.vacio;

        llenarLocalidades(selectZona, selectLocalidad, textoVacio);
        selectZona.addEventListener("change", function () {
            selectLocalidad.dataset.valor = "";
            llenarLocalidades(selectZona, selectLocalidad, textoVacio);
        });
    });

    document.querySelectorAll("form.validar").forEach(function (formulario) {
        prepararValidacion(formulario, function (form) {
            if (form.dataset.enviar === "si") {
                form.submit();
                return;
            }
            const destino = document.getElementById(form.dataset.exito);
            if (destino) {
                mostrarExito(destino, form.dataset.mensaje || "Listo, recibimos tus datos.");
            }
            form.reset();
        });
    });
});
