document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("solicitudForm");
  if(!form) return;

 function showNotice(msg){
  const box = document.getElementById("formNotice");
  if(!box) return;

  box.textContent = msg;
  box.classList.remove("hidden");
  box.scrollIntoView({ behavior: "smooth", block: "center" });
}


  form.addEventListener("submit", e => {

    /* =========================
       1️⃣ PRECIO OBLIGATORIO
    ========================== */
    const precioInput = document.getElementById("precio_total");
    if(!precioInput || !precioInput.value){
      e.preventDefault();
      showNotice("Debes calcular el precio antes de enviar la solicitud.");
      return;
    }

    /* =========================
       2️⃣ CAMPOS CRÍTICOS
    ========================== */
    const obligatorios = [
      "nombre",
      "apellidos",
      "telefono",
      "email",
      "motivo",
      "ciudad",
      "dia",
      "hora",
      "direccion"
    ];

    for(const id of obligatorios){
      const el = document.getElementById(id);
      if(!el || !el.value.trim()){
        e.preventDefault();
        showNotice("Por favor completa todos los campos obligatorios.");
        el?.focus();
        return;
      }
    }

    /* =========================
       3️⃣ CONSENTIMIENTO
    ========================== */
    const consent = form.querySelector('[name="consent_privacy"]');
    if(!consent || !consent.checked){
      e.preventDefault();
      showNotice("Debes aceptar el tratamiento de datos para continuar.");
      consent?.focus();
      return;
    }

    /* =========================
       4️⃣ OK → FORM SE ENVÍA
    ========================== */
    // Nada aquí. Formspree lo recibe limpio.

  });

});
