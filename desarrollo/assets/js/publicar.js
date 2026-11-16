const formPublicar = document.getElementById("form-publicar");
const salidaLugares = document.getElementById("p-lugares");
const botonMenos = document.getElementById("menos");
const botonMas = document.getElementById("mas");
const MIN_LUGARES = 1;
const MAX_LUGARES = 4;
let lugares = 2;

function actualizarContador() {
    salidaLugares.textContent = lugares;
    botonMenos.disabled = lugares <= MIN_LUGARES;
    botonMas.disabled = lugares >= MAX_LUGARES;
}

function leerFormulario() {
    return {
        id: Date.now(),
        zona: formPublicar.zona.value || "Tu zona",
        origen: formPublicar.origen.value || "Tu localidad",
        dia: formPublicar.dia.value || "Día",
        hora: formPublicar.hora.value || "--:--",
        lugares: lugares,
        aporte: Number(formPublicar.aporte.value) || 0,
        duracion: 50,
        espera: Number(formPublicar.espera.value),
        choferId: USUARIO
    };
}

function actualizarVistaPrevia() {
    const vista = document.getElementById("vista-previa");
    const tarjeta = crearTarjetaViaje(leerFormulario(), "#");
    const enlace = tarjeta.querySelector("a");
    enlace.removeAttribute("href");
    enlace.classList.add("disabled");
    enlace.setAttribute("aria-disabled", "true");
    vista.innerHTML = "";
    vista.appendChild(tarjeta);
}

document.addEventListener("DOMContentLoaded", function () {
    botonMenos.addEventListener("click", function () {
        if (lugares > MIN_LUGARES) { lugares--; }
        actualizarContador();
        actualizarVistaPrevia();
    });

    botonMas.addEventListener("click", function () {
        if (lugares < MAX_LUGARES) { lugares++; }
        actualizarContador();
        actualizarVistaPrevia();
    });

    formPublicar.addEventListener("input", actualizarVistaPrevia);
    formPublicar.addEventListener("change", actualizarVistaPrevia);

    formPublicar.addEventListener("reset", function () {
        lugares = 2;
        formPublicar.classList.remove("was-validated");
        formPublicar.querySelector(".resumen-errores").classList.add("d-none");
        setTimeout(function () {
            formPublicar.origen.dataset.valor = "";
            llenarLocalidades(formPublicar.zona, formPublicar.origen, "Elegí una localidad");
            actualizarContador();
            actualizarVistaPrevia();
        }, 0);
    });

    prepararValidacion(formPublicar, function () {
        const publicados = leerGuardado("publicados", []);
        publicados.push(leerFormulario());
        guardar("publicados", publicados);

        mostrarExito(
            document.getElementById("exito-publicar"),
            '<strong>¡Viaje publicado!</strong> Ya aparece para los pasajeros. Vas a ver las solicitudes en <a href="mis-viajes.html">Mis viajes</a>.'
        );
        formPublicar.reset();
    });

    actualizarContador();
    actualizarVistaPrevia();
});
