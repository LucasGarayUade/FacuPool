/* Ingresar: botón para mostrar u ocultar la contraseña.
   La validación de los formularios la hace main.js (clase .validar). */
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".ver-clave").forEach(function (boton) {
    boton.addEventListener("click", function () {
      const campo = document.getElementById(boton.dataset.campo);
      const mostrar = campo.type === "password";

      campo.type = mostrar ? "text" : "password";
      boton.setAttribute("aria-pressed", String(mostrar));
      boton.querySelector("i").className = mostrar ? "bi bi-eye-slash" : "bi bi-eye";
      boton.querySelector(".visually-hidden").textContent = mostrar ? "Ocultar contraseña" : "Mostrar contraseña";
    });
  });
});
