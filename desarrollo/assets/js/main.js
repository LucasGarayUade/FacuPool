/* =========================================================
   FacuPool · comportamiento común a todas las páginas
   ========================================================= */

/* Validación genérica de formularios con la clase .validar
   Usa la API de validación nativa del navegador (required,
   type="email", minlength, pattern) y los estilos de Bootstrap
   (.was-validated, .invalid-feedback) para mostrar el error
   debajo de cada campo. */
function prepararValidacion(formulario, alEnviarBien) {
  formulario.setAttribute("novalidate", ""); // usamos nuestros mensajes, no los del navegador

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const resumen = formulario.querySelector(".resumen-errores");

    if (!formulario.checkValidity()) {
      formulario.classList.add("was-validated");

      // Solo campos: un <fieldset> con un campo inválido adentro también cuenta como :invalid
      const invalidos = formulario.querySelectorAll("input:invalid, select:invalid, textarea:invalid");
      if (resumen) {
        resumen.textContent = invalidos.length === 1
          ? "Revisá 1 campo marcado en rojo."
          : "Revisá los " + invalidos.length + " campos marcados en rojo.";
        resumen.classList.remove("d-none");
      }
      // Lleva el foco al primer campo con error (teclado y lectores de pantalla)
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

/* Muestra un mensaje de éxito dentro de un contenedor con role="status" */
function mostrarExito(contenedor, mensajeHTML) {
  contenedor.innerHTML =
    '<div class="alert alert-success d-flex gap-2 align-items-start mb-0" role="alert">' +
    '<i class="bi bi-check-circle-fill" aria-hidden="true"></i><div>' + mensajeHTML + "</div></div>";
  contenedor.classList.remove("d-none");
  contenedor.setAttribute("tabindex", "-1");
  contenedor.focus();
}

document.addEventListener("DOMContentLoaded", function () {
  // Año actual en el pie de página
  const anio = document.getElementById("anio");
  if (anio) {
    anio.textContent = new Date().getFullYear();
  }

  // Formularios simples (ingresar, ayuda): validan y muestran éxito
  document.querySelectorAll("form.validar").forEach(function (formulario) {
    prepararValidacion(formulario, function (form) {
      // Formularios que llevan a otra página (buscador del inicio)
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
