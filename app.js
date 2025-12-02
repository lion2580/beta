document.addEventListener("DOMContentLoaded", () => {

    // --- Ciudades ---
    const ciudadesColombia = [
        "Bogotá","Medellín","Cali","Barranquilla","Cartagena",
        "Bucaramanga","Manizales","Pereira","Cúcuta","Santa Marta",
        "Pasto","Ibagué","Villavicencio","Armenia","Neiva",
        "Montería","Sincelejo","Tunja","Riohacha","Yopal",
        "Valledupar","Quibdó","Leticia","Florencia"
    ];
    const ciudadSelect = document.getElementById("ciudad");
    ciudadesColombia.forEach(ciudad => {
        const option = document.createElement("option");
        option.value = ciudad;
        option.textContent = ciudad;
        ciudadSelect.appendChild(option);
    });
    ciudadSelect.value = "";

    // --- DOM refs ---
    const loginModal = document.getElementById("loginModal");
    const openLogin = document.getElementById("openLogin");
    const closeLogin = document.getElementById("closeLogin");
    const doLogin = document.getElementById("doLogin");
    const loginUser = document.getElementById("loginUser");
    const loginPass = document.getElementById("loginPass");
    const loginMessage = document.getElementById("loginMessage");
    const usernameDisplay = document.getElementById("usernameDisplay");

    // fallback: if not exist (older HTML versions) define close/do
    if(!closeLogin){
        document.querySelectorAll('.modal .btn.ghost').forEach(b => {
            b.addEventListener('click', () => {
                loginModal.setAttribute('aria-hidden','true');
            });
        });
    }

    // login open button
    openLogin.addEventListener("click", () => {
        loginModal.setAttribute("aria-hidden","false");
    });

    // get elements that might not exist in some layouts
    const closeBtn = document.getElementById("closeLogin");
    if(closeBtn) closeBtn.addEventListener("click", () => {
        loginModal.setAttribute("aria-hidden","true");
        loginMessage.textContent = "";
    });

    // login action (mock)
    const doLoginBtn = document.getElementById("doLogin");
    if(doLoginBtn){
        doLoginBtn.addEventListener("click", () => {
            const u = loginUser.value.trim();
            const p = loginPass.value;
            if(!u || !p){
                loginMessage.textContent = "Usuario y contraseña requeridos (demo).";
                return;
            }
            localStorage.setItem("escolta_user", u);
            usernameDisplay.textContent = u;
            loginModal.setAttribute("aria-hidden","true");
            loginUser.value = "";
            loginPass.value = "";
            loginMessage.textContent = "";
            // optionally show a toast
        });
    }

    // inicializar usuario si existe
    const saved = localStorage.getItem("escolta_user");
    if(saved) usernameDisplay.textContent = saved;

    // --- mapa ---
    const direccionInput = document.getElementById("direccion");
    const showMapBtn = document.getElementById("showMap");
    const clearMapBtn = document.getElementById("clearMap");
    const mapContainer = document.getElementById("mapContainer");
    const mapFrame = document.getElementById("mapFrame");

    function showMapForAddress(address){
        if(!address) return;
        const q = encodeURIComponent(address);
        mapFrame.src = `https://www.google.com/maps?q=${q}&output=embed`;
        mapContainer.style.display = "block";
        mapContainer.setAttribute("aria-hidden","false");
    }
    function clearMap(){
        mapFrame.src = "";
        mapContainer.style.display = "none";
        mapContainer.setAttribute("aria-hidden","true");
    }
    if(showMapBtn) showMapBtn.addEventListener("click", () => {
        const a = direccionInput.value.trim();
        if(!a) return alert("Ingresa una dirección para mostrar en el mapa.");
        showMapForAddress(a);
    });
    if(clearMapBtn) clearMapBtn.addEventListener("click", clearMap);

    // --- precio ---
    const priceDisplay = document.getElementById("priceDisplay");
    const recalcBtn = document.getElementById("recalcPrice");
    const estimatePDF = document.getElementById("estimatePDF");

    function calcularPrecio(values){
        let baseHora = 45000;
        let escoltas = 1;
        if(values.amenaza === "high" || values.amenaza === "Enemigo armado" || values.armado === "yes") escoltas = 2;
        if(values.urgencia === "immediate" || values.urgencia === "Crítico") escoltas = Math.max(escoltas,2);

        let vehicleMultiplier = 1;
        if(values.vehiculo === "armored_van" || values.vehiculo === "Camioneta blindada" || values.vehiculo === "Auto blindado") vehicleMultiplier = 1.35;
        if(values.vehiculo === "suv" || values.vehiculo === "SUV") vehicleMultiplier = 1.15;

        let threatMultiplier = 1;
        if(values.amenaza === "high" || values.amenaza === "Alta" || values.amenaza === "Enemigo armado") threatMultiplier = 1.25;
        if(values.amenaza === "medium" || values.amenaza === "Media") threatMultiplier = 1.1;

        let urgencyMultiplier = 1;
        if(values.urgencia === "high" || values.urgencia === "Alta") urgencyMultiplier = 1.2;
        if(values.urgencia === "immediate" || values.urgencia === "Inmediata" || values.urgencia === "Crítico") urgencyMultiplier = 1.5;

        const horas = Math.max(1, Number(values.duracion) || 1);
        let subtotal = escoltas * baseHora * horas;
        let total = subtotal * vehicleMultiplier * threatMultiplier * urgencyMultiplier;

        const personas = Math.max(1, Number(values.personas) || 1);
        if(personas > 1) total += (personas - 1) * 12000 * horas;

        total = Math.ceil(total / 1000) * 1000;
        return { total, escoltas };
    }

    function mostrarPrecio(){
        const values = {
            urgencia: document.getElementById("urgencia") ? document.getElementById("urgencia").value : "medium",
            amenaza: document.getElementById("amenaza") ? document.getElementById("amenaza").value : "medium",
            armado: document.getElementById("armado") ? document.getElementById("armado").value : "no",
            vehiculo: document.getElementById("vehiculo") ? document.getElementById("vehiculo").value : "none",
            duracion: document.getElementById("duracion") ? document.getElementById("duracion").value : 1,
            personas: document.getElementById("personas") ? document.getElementById("personas").value : 1
        };
        const calc = calcularPrecio(values);
        priceDisplay.textContent = new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(calc.total);
        priceDisplay.dataset.value = calc.total;
    }

    ["urgencia","amenaza","armado","vehiculo","duracion","personas"].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.addEventListener("change", mostrarPrecio);
    });
    mostrarPrecio();
    if(recalcBtn) recalcBtn.addEventListener("click", mostrarPrecio);

    if(estimatePDF) estimatePDF.addEventListener("click", () => {
        const price = priceDisplay.dataset.value || priceDisplay.textContent;
        const nombre = document.getElementById("nombre").value || "Cliente";
        const motivo = document.getElementById("motivo").value || "";
        const text = `Estimado ${nombre}\nMotivo: ${motivo}\nPrecio estimado: ${price}\n(Estimado de ejemplo).`;
        const blob = new Blob([text], {type: "text/plain"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `estimado_${nombre.replace(/\s+/g,'_')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    });

    // --- form submit ---
    const form = document.getElementById("solicitudForm");
    const respuestaDiv = document.getElementById("respuesta");
    const resetBtn = document.getElementById("resetBtn");

    resetBtn.addEventListener("click", () => {
        form.reset();
        ciudadSelect.value = "";
        mostrarPrecio();
        clearMap();
        respuestaDiv.style.display = "none";
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const motivo = document.getElementById("motivo").value.trim();
        const ciudad = document.getElementById("ciudad").value;
        const dia = document.getElementById("dia").value;
        const hora = document.getElementById("hora").value;

        if(!nombre || !motivo || !ciudad || !dia || !hora){
            respuestaDiv.textContent = "Faltan datos obligatorios";
            respuestaDiv.style.display = "block";
            return;
        }

        const urgencia = document.getElementById("urgencia").value;
        const amenaza = document.getElementById("amenaza").value;
        const armado = document.getElementById("armado").value;
        const vehiculo = document.getElementById("vehiculo").value;
        const personas = Number(document.getElementById("personas").value || 1);
        const duracion = Number(document.getElementById("duracion").value || 1);
        const direccion = document.getElementById("direccion").value.trim();
        const usuario = localStorage.getItem("escolta_user") || "Invitado";

        const calc = calcularPrecio({urgencia, amenaza, armado, vehiculo, duracion, personas});
        const precioEstimado = calc.total;

        const datos = {
            usuario,
            nombre,
            motivo,
            ciudad,
            dia,
            hora,
            urgencia,
            amenaza,
            armado,
            vehiculo,
            personas,
            duracion,
            direccion,
            precioEstimado,
            creadoEn: new Date().toISOString()
        };

        try {
            const resp = await fetch("/solicitud", {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(datos)
            });
            const result = await resp.json();
            respuestaDiv.textContent = result.mensaje || "¡Datos enviados con éxito!";
            respuestaDiv.style.display = "block";
            form.reset();
            ciudadSelect.value = "";
            mostrarPrecio();
            clearMap();
            setTimeout(()=> respuestaDiv.style.display="none", 6000);
        } catch (err) {
            console.error(err);
            respuestaDiv.textContent = "Error al enviar la solicitud";
            respuestaDiv.style.display = "block";
        }
    });

});
