// ------------------------------
// LOGIN LOCAL MOCK
// ------------------------------
const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const closeLogin = document.getElementById("closeLogin");
const doLogin = document.getElementById("doLogin");
const usernameDisplay = document.getElementById("usernameDisplay");

loginBtn.addEventListener("click", () => {
    loginModal.style.display = "block";
});

closeLogin.addEventListener("click", () => {
    loginModal.style.display = "none";
});

doLogin.addEventListener("click", () => {
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value.trim();

    if (user && pass) {
        usernameDisplay.textContent = user;
        document.getElementById("loginMessage").textContent = "Sesión iniciada.";
        setTimeout(() => (loginModal.style.display = "none"), 1000);
    } else {
        document.getElementById("loginMessage").textContent = "Completa ambos campos.";
    }
});

// ------------------------------
// MAPA
// ------------------------------
const showMap = document.getElementById("showMap");
const clearMap = document.getElementById("clearMap");
const mapContainer = document.getElementById("mapContainer");
const mapFrame = document.getElementById("mapFrame");

showMap.addEventListener("click", () => {
    const direccion = document.getElementById("direccion").value.trim();
    if (!direccion) {
        alert("Escribe una dirección para mostrar el mapa.");
        return;
    }
    mapFrame.src = `https://maps.google.com/maps?q=${encodeURIComponent(direccion)}&output=embed`;
    mapContainer.style.display = "block";
    mapContainer.setAttribute("aria-hidden", "false");
});

clearMap.addEventListener("click", () => {
    mapFrame.src = "";
    mapContainer.style.display = "none";
    mapContainer.setAttribute("aria-hidden", "true");
});

// ------------------------------
// PRECIO SIMPLIFICADO
// ------------------------------
function calcularPrecio() {
    const base = 50000;
    let total = base;

    const urgencia = document.getElementById("urgencia").value;
    const duracion = parseInt(document.getElementById("duracion").value) || 1;

    if (urgencia === "high") total += 30000;
    if (urgencia === "immediate") total += 50000;

    total += duracion * 20000;

    return total;
}

const recalcPrice = document.getElementById("recalcPrice");
const priceDisplay = document.getElementById("priceDisplay");

function actualizarPrecio() {
    const precio = calcularPrecio();
    priceDisplay.textContent = "$" + precio.toLocaleString();
}

recalcPrice.addEventListener("click", actualizarPrecio);
actualizarPrecio();

// ------------------------------
// FORMULARIO + FORMSpree
// ------------------------------
const form = document.getElementById("solicitudForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const campos = form.querySelectorAll("input, select, textarea");

    for (let campo of campos) {
        if (!campo.value.trim()) {
            alert("Faltan datos obligatorios.");
            return;
        }
    }

    const formData = new FormData(form);

    try {
        const respuesta = await fetch("https://formspree.io/f/mrbnkypq", {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json"
            }
        });

        if (respuesta.ok) {
            document.getElementById("respuesta").textContent =
                "Solicitud enviada correctamente. Nuestro equipo se pondrá en contacto.";
            form.reset();
            actualizarPrecio();
        } else {
            document.getElementById("respuesta").textContent =
                "Error al enviar. Intenta nuevamente.";
        }
    } catch (error) {
        document.getElementById("respuesta").textContent =
            "Error de conexión. Revisa tu red.";
    }
});

// ------------------------------
// LIMPIAR FORMULARIO
// ------------------------------
document.getElementById("resetBtn").addEventListener("click", () => {
    form.reset();
    actualizarPrecio();
    mapFrame.src = "";
    mapContainer.style.display = "none";
});

