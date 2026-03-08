document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("solicitudForm");
  const notice = document.getElementById("formNotice");

  if(!form) return;

  function showNotice(msg){
    if(!notice) return;
    notice.textContent = msg;
    notice.classList.remove("hidden");
    notice.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  form.addEventListener("submit", (e) => {
    form.classList.add("was-validated");

    /* =========================
       1️⃣ VALIDACIÓN NATIVA HTML
    ========================== */

  if(!form.checkValidity()){

  e.preventDefault();

  const firstInvalid = form.querySelector(":invalid");

  if(firstInvalid){

    // buscar el paso donde está el campo
    const step = firstInvalid.closest(".step");

    if(step){

      // desactivar pasos
      document.querySelectorAll(".step").forEach(s=>{
        s.classList.remove("active");
      });

      // activar el paso correcto
      step.classList.add("active");

    }

    // enfocar campo
    firstInvalid.focus();

  }

  showNotice("⚠ Faltan campos por completar. Revisa los marcados en rojo.");

  return;
}

    /* =========================
       2️⃣ PRECIO CALCULADO
    ========================== */

    const precioInput = document.getElementById("precio_total");

    if(!precioInput || !precioInput.value){
      e.preventDefault();
      showNotice("Debes calcular el precio antes de enviar la solicitud.");
      return;
    }

    /* =========================
       3️⃣ CONSENTIMIENTO
    ========================== */

    const consent = form.querySelector('[name="consent_privacy"]');

    if(!consent || !consent.checked){
      e.preventDefault();
      showNotice("Debes aceptar el tratamiento de datos para continuar.");
      consent.focus();
      return;
    }

    /* =========================
       4️⃣ TODO CORRECTO
    ========================== */

    // Formspree recibe el formulario normalmente

  });

});