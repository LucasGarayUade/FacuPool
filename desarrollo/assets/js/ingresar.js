document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".ver-clave").forEach(function (boton) {
        boton.addEventListener("click", function () {
            const campo = document.getElementById(boton.dataset.campo);
            const mostrar = campo.type === "password";

            campo.type = mostrar ? "text" : "password";
            boton.setAttribute("aria-pressed", String(mostrar));
            boton.textContent = mostrar ? "Ocultar" : "Mostrar";
        });
    });
});
