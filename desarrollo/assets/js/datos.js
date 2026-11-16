const DESTINO = "UADE Monserrat";

const ZONAS = {
    "CABA": ["Palermo", "Belgrano", "Caballito", "Flores", "Villa Urquiza", "Almagro"],
    "Zona Norte": ["Olivos", "San Isidro", "Vicente López", "Martínez", "Tigre"],
    "Zona Sur": ["Lanús", "Quilmes", "Avellaneda", "Lomas de Zamora", "Banfield"],
    "Zona Oeste": ["Ramos Mejía", "Morón", "Haedo", "Castelar", "Ituzaingó"]
};

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const FRANJAS = {
    manana: { texto: "Mañana (6 a 12 h)", desde: 6, hasta: 12, horas: ["07:00", "07:30", "08:00", "09:30", "10:30"] },
    tarde: { texto: "Tarde (12 a 18 h)", desde: 12, hasta: 18, horas: ["12:30", "13:30", "14:00", "16:30"] },
    noche: { texto: "Noche (18 a 24 h)", desde: 18, hasta: 24, horas: ["18:00", "18:30", "19:00", "20:30"] }
};

const FACULTADES = ["FACE", "FAIN", "FARU", "FADI", "FAJU", "FASA", "FAEN"];

const CHOFERES = [
    { id: "c1", nombre: "Martina", apellido: "Pereyra", facultad: "FAIN", anio: "3.º año", viajes: 42, desde: "marzo 2025",
        resenas: [{ autor: "Lucía Benítez", estrellas: 5, texto: "Súper puntual y muy amable. Avisa si hay tránsito." }, { autor: "Tomás Rivas", estrellas: 5, texto: "Viaje tranquilo, el punto de encuentro es muy fácil." }] },
    { id: "c2", nombre: "Tomás", apellido: "Rivas", facultad: "FACE", anio: "2.º año", viajes: 18, desde: "agosto 2025",
        resenas: [{ autor: "Camila Sosa", estrellas: 4, texto: "Muy buena onda, llegó cinco minutos tarde una vez." }] },
    { id: "c3", nombre: "Camila", apellido: "Sosa", facultad: "FADI", anio: "4.º año", viajes: 65, desde: "abril 2024",
        resenas: [{ autor: "Franco Díaz", estrellas: 5, texto: "La recomiendo, siempre responde rápido." }, { autor: "Abril Torres", estrellas: 5, texto: "Muy prolija con los horarios." }, { autor: "Bruno López", estrellas: 4, texto: "Todo bien, el auto es cómodo." }] },
    { id: "c4", nombre: "Joaquín", apellido: "Medina", facultad: "FAIN", anio: "5.º año", viajes: 80, desde: "marzo 2024",
        resenas: [{ autor: "Valentina Gómez", estrellas: 5, texto: "Excelente, maneja con mucho cuidado." }, { autor: "Ramiro Castro", estrellas: 4, texto: "Puntual. A veces pone la música fuerte." }] },
    { id: "c5", nombre: "Lucía", apellido: "Benítez", facultad: "FAJU", anio: "1.º año", viajes: 6, desde: "septiembre 2026",
        resenas: [{ autor: "Martina Pereyra", estrellas: 5, texto: "Muy amable, todo coordinado por el chat." }] },
    { id: "c6", nombre: "Franco", apellido: "Díaz", facultad: "FARU", anio: "2.º año", viajes: 24, desde: "febrero 2025",
        resenas: [{ autor: "Sofía Vera", estrellas: 4, texto: "Buen viaje, recomiendo." }, { autor: "Tomás Rivas", estrellas: 5, texto: "Muy responsable." }] },
    { id: "c7", nombre: "Abril", apellido: "Torres", facultad: "FASA", anio: "3.º año", viajes: 37, desde: "julio 2025",
        resenas: [{ autor: "Joaquín Medina", estrellas: 5, texto: "Impecable, siempre a horario." }] },
    { id: "c8", nombre: "Ramiro", apellido: "Castro", facultad: "FAEN", anio: "4.º año", viajes: 51, desde: "marzo 2025",
        resenas: [{ autor: "Lucía Benítez", estrellas: 4, texto: "Muy correcto. El aporte es justo." }, { autor: "Camila Sosa", estrellas: 5, texto: "Lo volvería a elegir." }] },
    { id: "c9", nombre: "Sofía", apellido: "Vera", facultad: "FACE", anio: "1.º año", viajes: 9, desde: "agosto 2026",
        resenas: [{ autor: "Abril Torres", estrellas: 5, texto: "Muy simpática y puntual." }] },
    { id: "c10", nombre: "Bruno", apellido: "López", facultad: "FAJU", anio: "3.º año", viajes: 29, desde: "mayo 2025",
        resenas: [{ autor: "Franco Díaz", estrellas: 4, texto: "Todo en orden, buen trato." }] },
    { id: "yo", nombre: "Nicolás", apellido: "Argüello", facultad: "FAIN", anio: "3.º año", viajes: 12, desde: "marzo 2026",
        resenas: [{ autor: "Sofía Vera", estrellas: 5, texto: "Muy puntual y buena onda." }] }
];

const USUARIO = "yo";

function crearAleatorio(semilla) {
    return function () {
        semilla = (semilla + 0x6D2B79F5) | 0;
        let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function generarViajes() {
    const azar = crearAleatorio(2026);
    const elegir = function (lista) { return lista[Math.floor(azar() * lista.length)]; };
    const lista = [];
    let id = 1;

    for (const zona in ZONAS) {
        const esCaba = zona === "CABA";
        DIAS.forEach(function (dia) {
            for (const franja in FRANJAS) {
                const cantidad = azar() < 0.5 ? 1 : 2;
                for (let i = 0; i < cantidad; i++) {
                    const origen = elegir(ZONAS[zona]);
                    lista.push({
                        id: id++,
                        zona: zona,
                        origen: origen,
                        dia: dia,
                        hora: elegir(FRANJAS[franja].horas),
                        lugares: azar() < 0.15 ? 0 : 1 + Math.floor(azar() * 4),
                        aporte: esCaba ? 1500 + Math.floor(azar() * 11) * 100 : 3000 + Math.floor(azar() * 16) * 100,
                        duracion: esCaba ? 20 + Math.floor(azar() * 16) : 40 + Math.floor(azar() * 36),
                        choferId: elegir(CHOFERES.slice(0, -1)).id,
                        punto: (esCaba ? "Plaza principal de " : "Estación ") + origen,
                        espera: azar() < 0.6 ? 5 : 10
                    });
                }
            }
        });
    }
    return lista;
}

const VIAJES = generarViajes();

function formatearPlata(numero) {
    return "$" + Number(numero).toLocaleString("es-AR");
}

function iniciales(nombre) {
    const partes = nombre.trim().split(" ");
    return (partes[0][0] + (partes[1] ? partes[1][0] : "")).toUpperCase();
}

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

function buscarChofer(id) {
    return CHOFERES.find(function (c) { return c.id === id; });
}

function nombreCompleto(persona) {
    return persona.nombre + " " + persona.apellido;
}

function promedioEstrellas(chofer) {
    const total = chofer.resenas.reduce(function (suma, r) { return suma + r.estrellas; }, 0);
    return (total / chofer.resenas.length).toFixed(1);
}

function escaparHTML(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

function leerGuardado(clave, valorPorDefecto) {
    try {
        const dato = localStorage.getItem("facupool2-" + clave);
        return dato ? JSON.parse(dato) : valorPorDefecto;
    } catch (error) {
        return valorPorDefecto;
    }
}

function guardar(clave, valor) {
    try {
        localStorage.setItem("facupool2-" + clave, JSON.stringify(valor));
        return true;
    } catch (error) {
        return false;
    }
}

function rutaHTML(origen) {
    return "<span>" + escaparHTML(origen) + '</span><span class="linea-ruta" aria-hidden="true"></span><span>' + DESTINO + "</span>";
}

function crearTarjetaViaje(viaje, rutaDetalle) {
    const completo = viaje.lugares === 0;
    const chofer = buscarChofer(viaje.choferId);
    const articulo = document.createElement("article");
    articulo.className = "tarjeta-viaje" + (completo ? " completo" : "");

    const lugaresTexto = completo
        ? '<span class="insignia completo">Completo</span>'
        : '<span class="insignia">' + viaje.lugares + (viaje.lugares === 1 ? " lugar libre" : " lugares libres") + "</span>";

    articulo.innerHTML =
        '<div class="viaje-hora"><strong>' + viaje.hora + "</strong><span>" + viaje.dia + "</span></div>" +
        '<div class="d-flex flex-column gap-2">' +
            '<h3 class="viaje-ruta ruta mb-0">' + rutaHTML(viaje.origen) + "</h3>" +
            '<ul class="datos">' +
                "<li>" + escaparHTML(viaje.zona) + "</li>" +
                "<li>Aporte <strong>" + formatearPlata(viaje.aporte) + "</strong></li>" +
                "<li>" + viaje.duracion + " min</li>" +
            "</ul>" +
            '<p class="d-flex align-items-center gap-2 mb-0 small"><span class="avatar" aria-hidden="true">' + iniciales(nombreCompleto(chofer)) + "</span>" +
                "<span>" + escaparHTML(nombreCompleto(chofer)) + '<br><span class="texto-suave">' + chofer.facultad + " · " + chofer.anio + " · ★ " + promedioEstrellas(chofer) + "</span></span></p>" +
        "</div>" +
        '<div class="viaje-acciones">' + lugaresTexto +
            '<a class="btn btn-outline-primary btn-sm" href="' + rutaDetalle + "?id=" + viaje.id + '">Ver detalle<span class="visually-hidden"> del viaje desde ' + escaparHTML(viaje.origen) + " a las " + viaje.hora + "</span></a>" +
        "</div>";

    return articulo;
}

leerGuardado("publicados", []).forEach(function (viaje) {
    VIAJES.push(viaje);
});
