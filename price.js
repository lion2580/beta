const TARIFAS = {
  base: 200000,
  personaExtra: 50000,
  horaExtra: 40000,
  urgencia: {
    normal: 1,
    high: 1.3,
    immediate: 1.6
  },
  amenaza: {
    low: 1,
    medium: 1.2,
    high: 1.5
  }
};

document.addEventListener("DOMContentLoaded", () => {

  const submitBtn = document.getElementById("submitBtn");
  const priceDisplay = document.getElementById("priceDisplay");
  const btnRecalc = document.getElementById("recalcPrice");

  if(submitBtn){
    submitBtn.disabled = true; // 🔒 estado inicial
  }

  const campos = {
    urgencia: document.getElementById("urgencia"),
    amenaza: document.getElementById("amenaza"),
    personas: document.getElementById("personas"),
    duracion: document.getElementById("duracion")
  };

  Object.values(campos).forEach(campo => {
    if(campo){
      campo.addEventListener("change", calcularPrecio);
      campo.addEventListener("input", calcularPrecio);
    }
  });

  if(btnRecalc){
    btnRecalc.addEventListener("click", calcularPrecio);
  }

  function calcularPrecio(){
    if(!priceDisplay) return;

    priceDisplay.textContent = "Calculando…";
    priceDisplay.classList.remove("ready", "error");
    priceDisplay.classList.add("loading");

    let total = TARIFAS.base;

    const personas = Math.max(1, parseInt(campos.personas?.value || 1));
    const horas = Math.max(1, parseInt(campos.duracion?.value || 1));

    total += (personas - 1) * TARIFAS.personaExtra;
    total += (horas - 1) * TARIFAS.horaExtra;

    const urgenciaFactor =
      TARIFAS.urgencia[campos.urgencia?.value] || 1;

    const amenazaFactor =
      TARIFAS.amenaza[campos.amenaza?.value] || 1;

    total *= urgenciaFactor * amenazaFactor;

    setTimeout(() => {
      const precioFinal = Math.round(total);

      priceDisplay.dataset.price = precioFinal;
      document.getElementById("precio_total").value = precioFinal;

      priceDisplay.textContent =
        `$ ${precioFinal.toLocaleString("es-CO")} COP`;

      priceDisplay.classList.remove("loading");
      priceDisplay.classList.add("ready");

      // 🔓 habilitar envío SOLO cuando hay precio válido
      if(submitBtn){
        submitBtn.disabled = false;
      }

    }, 300);
  }

  calcularPrecio(); // cálculo inicial
});
