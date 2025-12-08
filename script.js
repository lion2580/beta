// script-ciudades.js (reemplaza tu antiguo script.js por este)

// --- Seguridad: evitar errores si elementos no existen ---
function safeGet(id) {
    return document.getElementById(id) || null;
}

// --- Sidebar (si existe) ---
const sidebar = safeGet("sidebar");
const btnToggle = safeGet("toggleSidebar");
if (btnToggle && sidebar) {
    btnToggle.addEventListener("click", () => {
        const posActual = sidebar.style.left;
        sidebar.style.left = (posActual === "0px") ? "-240px" : "0px";
    });
}

// --- Lista de ciudades (fuente única) ---
const ciudades = [
    "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Bucaramanga",
    "Santa Marta", "Pereira", "Manizales", "Cúcuta", "Ibagué", "Villavicencio",
    "Pasto", "Tunja", "Valledupar", "Leticia"
];

// --- Función para poblar el select de ciudades ---
function poblarCiudades() {
    const ciudadSelect = safeGet("ciudad");
    if (!ciudadSelect) {
        console.warn("select #ciudad no encontrado en el DOM.");
        return;
    }

    // Limpiar opciones existentes excepto la primera (placeholder)
    while (ciudadSelect.options.length > 1) {
        ciudadSelect.remove(1);
    }

    // Añadir opciones si no están ya
    ciudades.forEach(c => {
        // evitar duplicados exactos
        const existe = Array.from(ciudadSelect.options).some(op => op.value === c);
        if (!existe) {
            const op = document.createElement("option");
            op.textContent = c;
            op.value = c;
            ciudadSelect.appendChild(op);
        }
    });

    // Asegurar que el select esté habilitado y sea accesible
    ciudadSelect.disabled = false;
    ciudadSelect.tabIndex = 0;

    // Forzar posicionamiento/z-index para evitar overlays que oculten el dropdown.
    // Lo aplicamos inline para no tocar tu CSS global (solo si es necesario).
    try {
        // Muchos navegadores ignoran z-index del listado nativo; esto ayuda en casos donde
        // contenedores superpuestos están bloqueando la interacción.
        ciudadSelect.style.position = ciudadSelect.style.position || "relative";
        ciudadSelect.style.zIndex = "9999";
    } catch (e) {
        // si algo falla, no cortamos la ejecución
        console.warn("No se pudo ajustar estilo inline del select:", e);
    }

    // Pequeño test log para confirmar que se pobló
    console.info(`Select #ciudad poblado con ${ciudadSelect.options.length - 1} ciudades.`);
}

// --- Comprobación y mensajería visual (debug rápido) ---
function comprobarInteraccionSelect() {
    const ciudadSelect = safeGet("ciudad");
    if (!ciudadSelect) return;

    ciudadSelect.addEventListener("focus", () => {
        console.debug("#ciudad focus recibido");
    });
    ciudadSelect.addEventListener("click", () => {
        console.debug("#ciudad click recibido (intento desplegar)");
    });
    ciudadSelect.addEventListener("change", () => {
        console.debug("#ciudad change:", ciudadSelect.value);
    });
}

// --- Document ready ---
document.addEventListener("DOMContentLoaded", () => {
    try {
        poblarCiudades();
        comprobarInteraccionSelect();
    } catch (err) {
        console.error("Error inicializando ciudades:", err);
    }
});
