/* =========================================================
   FacuPool · datos de ejemplo y funciones compartidas
   No hay servidor: los viajes viven en este arreglo y lo que
   el usuario hace (solicitudes, viajes publicados) se guarda
   en localStorage del navegador.
   ========================================================= */

const VIAJES = [
  { id: 1, zona: "Zona Oeste", origen: "Ramos Mejía", dia: "Lunes", hora: "07:30", lugares: 2, aporte: 3500, duracion: 55, chofer: "Martina P.", carrera: "Ingeniería Industrial", anio: "3.º año", punto: "Estación Ramos Mejía, salida Av. de Mayo", espera: 5 },
  { id: 2, zona: "Zona Norte", origen: "Olivos", dia: "Lunes", hora: "08:00", lugares: 1, aporte: 4000, duracion: 50, chofer: "Tomás R.", carrera: "Lic. en Administración", anio: "2.º año", punto: "Estación Olivos, lado Maipú", espera: 5 },
  { id: 3, zona: "Zona Oeste", origen: "Morón", dia: "Lunes", hora: "07:45", lugares: 3, aporte: 3000, duracion: 60, chofer: "Camila S.", carrera: "", anio: "", punto: "Plaza de Morón, esquina Belgrano", espera: 10 },
  { id: 4, zona: "Zona Sur", origen: "Lanús", dia: "Martes", hora: "07:30", lugares: 2, aporte: 3200, duracion: 45, chofer: "Joaquín M.", carrera: "Ingeniería Informática", anio: "4.º año", punto: "Estación Lanús, salida Av. Hipólito Yrigoyen", espera: 5 },
  { id: 5, zona: "Zona Sur", origen: "Quilmes", dia: "Martes", hora: "08:30", lugares: 1, aporte: 4200, duracion: 70, chofer: "Lucía B.", carrera: "Abogacía", anio: "1.º año", punto: "Estación Quilmes, lado Rivadavia", espera: 5 },
  { id: 6, zona: "Zona Oeste", origen: "Haedo", dia: "Miércoles", hora: "13:30", lugares: 2, aporte: 3300, duracion: 50, chofer: "Franco D.", carrera: "Diseño Gráfico", anio: "2.º año", punto: "Estación Haedo, salida Av. Rivadavia", espera: 5 },
  { id: 7, zona: "Zona Norte", origen: "San Isidro", dia: "Miércoles", hora: "18:00", lugares: 3, aporte: 4500, duracion: 65, chofer: "Abril T.", carrera: "", anio: "", punto: "Catedral de San Isidro, frente a la plaza", espera: 10 },
  { id: 8, zona: "Zona Norte", origen: "Vicente López", dia: "Jueves", hora: "07:30", lugares: 2, aporte: 3900, duracion: 45, chofer: "Ramiro C.", carrera: "Ingeniería Industrial", anio: "5.º año", punto: "Estación Vicente López, lado Mitre", espera: 5 },
  { id: 9, zona: "Zona Oeste", origen: "Ramos Mejía", dia: "Lunes", hora: "07:15", lugares: 0, aporte: 3500, duracion: 55, chofer: "Sofía V.", carrera: "Lic. en Administración", anio: "1.º año", punto: "Estación Ramos Mejía, salida Av. de Mayo", espera: 5 }
];

/* Franjas horarias del buscador */
const FRANJAS = {
  manana: { texto: "Mañana (6 a 12 h)", desde: 6, hasta: 12 },
  tarde: { texto: "Tarde (12 a 18 h)", desde: 12, hasta: 18 },
  noche: { texto: "Noche (18 a 24 h)", desde: 18, hasta: 24 }
};

/* $3.500 con formato argentino */
function formatearPlata(numero) {
  return "$" + Number(numero).toLocaleString("es-AR");
}

/* "Martina P." -> "MP" */
function iniciales(nombre) {
  const partes = nombre.replace(".", "").split(" ");
  return (partes[0][0] + (partes[1] ? partes[1][0] : "")).toUpperCase();
}

/* "07:30" -> "manana" */
function franjaDeHora(hora) {
  const h = parseInt(hora, 10);
  for (const clave in FRANJAS) {
    if (h >= FRANJAS[clave].desde && h < FRANJAS[clave].hasta) {
      return clave;
    }
  }
  return "noche";
}

function buscarViaje(id) {
  return VIAJES.find(function (v) { return v.id === Number(id); });
}

/* Evita que un texto cargado por el usuario se interprete como HTML */
function escaparHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

/* localStorage puede fallar (modo privado, permisos): por eso try/catch */
function leerGuardado(clave, valorPorDefecto) {
  try {
    const dato = localStorage.getItem("facupool-" + clave);
    return dato ? JSON.parse(dato) : valorPorDefecto;
  } catch (error) {
    return valorPorDefecto;
  }
}

function guardar(clave, valor) {
  try {
    localStorage.setItem("facupool-" + clave, JSON.stringify(valor));
    return true;
  } catch (error) {
    return false;
  }
}

/* Tarjeta de viaje reutilizada en Inicio y en Buscar.
   rutaDetalle: camino relativo a detalle.html según desde dónde se llame. */
function crearTarjetaViaje(viaje, rutaDetalle) {
  const completo = viaje.lugares === 0;
  const articulo = document.createElement("article");
  articulo.className = "tarjeta-viaje" + (completo ? " completo" : "");

  const perfil = viaje.carrera
    ? viaje.carrera + " · " + viaje.anio
    : "Prefiere no mostrar carrera";

  const lugaresTexto = completo
    ? '<span class="insignia completo"><i class="bi bi-x-circle" aria-hidden="true"></i>Completo</span>'
    : '<span class="insignia"><i class="bi bi-person" aria-hidden="true"></i>' + viaje.lugares + (viaje.lugares === 1 ? " lugar libre" : " lugares libres") + "</span>";

  articulo.innerHTML =
    '<div class="viaje-hora"><strong>' + viaje.hora + "</strong><span>" + viaje.dia + "</span></div>" +
    '<div class="d-flex flex-column gap-2">' +
      '<h3 class="viaje-ruta ruta mb-0"><span>' + escaparHTML(viaje.origen) + '</span><span class="linea-ruta" aria-hidden="true"></span><span>Facultad</span></h3>' +
      '<ul class="datos">' +
        '<li><i class="bi bi-geo-alt" aria-hidden="true"></i>' + escaparHTML(viaje.zona) + "</li>" +
        '<li><i class="bi bi-cash-coin" aria-hidden="true"></i>Aporte <strong>' + formatearPlata(viaje.aporte) + "</strong></li>" +
        '<li><i class="bi bi-clock" aria-hidden="true"></i>' + viaje.duracion + " min</li>" +
      "</ul>" +
      '<p class="d-flex align-items-center gap-2 mb-0 small"><span class="avatar" aria-hidden="true">' + iniciales(viaje.chofer) + "</span>" +
        "<span>" + escaparHTML(viaje.chofer) + '<br><span class="texto-suave">' + escaparHTML(perfil) + "</span></span></p>" +
    "</div>" +
    '<div class="viaje-acciones">' + lugaresTexto +
      '<a class="btn btn-outline-primary btn-sm" href="' + rutaDetalle + "?id=" + viaje.id + '">Ver detalle<span class="visually-hidden"> del viaje desde ' + escaparHTML(viaje.origen) + " a las " + viaje.hora + "</span></a>" +
    "</div>";

  return articulo;
}

/* Los viajes que el usuario publicó en este navegador se suman a la lista */
leerGuardado("publicados", []).forEach(function (viaje) {
  VIAJES.push(viaje);
});
