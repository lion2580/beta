function showNotice(msg){
  const box = document.getElementById("formNotice");
  if(!box) return;
  box.textContent = msg;
  box.classList.remove("hidden");
}

function val(id){
  const el = document.getElementById(id);
  if(!el) return null;

  if(el.tagName === "SELECT"){
    return el.options[el.selectedIndex]?.text || null;
  }

  return el.value?.trim() || null;
}

const btnPDF = document.getElementById("estimatePDF");

if(btnPDF){
  btnPDF.addEventListener("click", generarPDF);
}

function generarPDF(){

  // consentimiento obligatorio
  const consent = document.querySelector('[name="consent_privacy"]');
  if(!consent || !consent.checked){
    showNotice("Debes aceptar el tratamiento de datos antes de exportar el PDF.");
    consent.focus();
    return;
  }

  const precio = document.getElementById("priceDisplay")?.dataset.price;
  if(!precio){
    showNotice("Calcula el precio antes de exportar.");
    return;
  }

  if(!window.jspdf || !window.jspdf.jsPDF){
    showNotice("Error al cargar el generador de PDF.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 20;

  const ahora = new Date();
  const fechaGen = ahora.toLocaleDateString("es-CO");
  const horaGen = ahora.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const add = (label, value) => {

    if(!value) return;

    if(y > 270){
      doc.addPage();
      y = 20;
    }

    doc.text(`${label}: ${value}`, 20, y);
    y += 8;
  };

  // TÍTULO
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Resumen de solicitud de servicio", 20, y);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Generado el ${fechaGen} a las ${horaGen}`, 20, y + 6);

  y += 16;

  doc.setFontSize(11);

  // DATOS PERSONALES
  add("Nombre del responsable", val("nombre"));
  add("Cargo / Rol", val("cargo"));
  add("Teléfono", val("telefono"));
  add("Correo", val("email"));

  y += 6;

  // CONTEXTO DEL SERVICIO
  add("Tipo de servicio", val("tipoServicio"));
  add("Ciudad", val("ciudad"));
  add("Fecha estimada", val("fechaInicio"));
  add("Hora estimada", val("horaInicio"));
  add("Prioridad", val("urgencia"));

  y += 6;

  // COMPLEJIDAD
  add("Nivel de exposición", val("exposicion"));
  add("Personas involucradas", val("personas"));
  add("Duración del servicio (horas)", val("duracion"));
  add("Tipo de vehículo", val("vehiculo"));
  add("Incluye traslados", val("traslados"));
  add("Horario del servicio", val("horarios"));

  y += 6;

  // UBICACIÓN
  add("Ciudad del servicio", val("ciudadMapa"));
  add("Dirección", val("direccion"));
  add("Referencia", val("referencia"));

  y += 10;

  // PRECIO
  doc.setFont("helvetica", "bold");
  doc.text(
    `Precio estimado: $ ${Number(precio).toLocaleString("es-CO")} COP`,
    20,
    y
  );

  y += 10;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  doc.text(
    "Este documento es un estimado generado automáticamente según la información proporcionada.",
    20,
    y,
    { maxWidth: 170 }
  );

  doc.save("resumen-solicitud.pdf");
}