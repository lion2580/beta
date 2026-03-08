document.addEventListener("DOMContentLoaded", () => {

  // 🔹 ELEMENTOS
  const ciudad = document.getElementById("ciudadMapa"); 
  const direccion = document.getElementById("direccion");
  const btnMapa = document.getElementById("btnMapa");
  const mapContainer = document.getElementById("mapContainer");
  const mapError = document.getElementById("mapError");
  const latInput = document.getElementById("latitud");
  const lngInput = document.getElementById("longitud");

  // 🔹 ESTADO
  let map = null;
  let marker = null;
  let timeoutBusqueda = null;

  // 🗺️ CREAR MAPA
  function crearMapa(){
    if(map) return;

    mapContainer.classList.add("active");

    map = L.map("map").setView([4.5709, -74.2973], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(map);

    // 🖱️ CLICK EN EL MAPA
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      moverMarcador(lat, lng);
      actualizarDireccionDesdeMapa(lat, lng);
    });

    setTimeout(() => map.invalidateSize(), 200);
  }

  // 📍 MOVER MARCADOR
  function moverMarcador(lat, lon){
    if(marker) marker.remove();
    marker = L.marker([lat, lon]).addTo(map);
    map.setView([lat, lon], 17);
  }

  // 🔎 BUSCAR DIRECCIÓN (texto → mapa)
  function buscarDireccion(forzar = false){
    mapError.textContent = "";

    if(!forzar && (!ciudad.value || !direccion.value)) return;

    if(forzar && (!ciudad.value || !direccion.value)){
      mapError.textContent = "Completa ciudad y dirección.";
      return;
    }

    crearMapa();

    const query = `${direccion.value}, ${ciudad.value}`;

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&countrycodes=co&q=${encodeURIComponent(query)}`
    )
      .then(res => res.json())
      .then(data => {
        if(!data.length){
          mapError.textContent = "No se encontró la ubicación.";
          return;
        }
        moverMarcador(data[0].lat, data[0].lon);
      })
      .catch(() => {
        mapError.textContent = "Error al buscar la ubicación.";
      });
  }

  // ⏱️ DELAY AL ESCRIBIR
  function buscarConDelay(){
    clearTimeout(timeoutBusqueda);
    if(!ciudad.value || !direccion.value) return;

    timeoutBusqueda = setTimeout(() => {
      buscarDireccion(false);
    }, 600);
  }
function formatearDireccion(address){
  const partes = [];

  if(address.road) partes.push(address.road);
  if(address.neighbourhood) partes.push(address.neighbourhood);
  if(address.suburb) partes.push(address.suburb);
  if(address.city) partes.push(address.city);
  if(address.country) partes.push(address.country);

  return partes.join(", ");
}

  // 🔁 MAPA → DIRECCIÓN (reverse)
  function actualizarDireccionDesdeMapa(lat, lon){
  mapError.textContent = "";

  fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
  )
    .then(res => res.json())
    .then(data => {
      if(!data.address){
        mapError.textContent = "No se pudo obtener la dirección.";
        return;
      }

      // 📍 Dirección clara
      direccion.value = formatearDireccion(data.address);

      // 🧭 Coordenadas exactas
      latInput.value = lat;
      lngInput.value = lon;
    })
    .catch(() => {
      mapError.textContent = "Error al obtener la dirección desde el mapa.";
    });
}


  // 🎯 EVENTOS
  btnMapa.addEventListener("click", () => buscarDireccion(true));
  ciudad.addEventListener("change", buscarConDelay);
  direccion.addEventListener("input", buscarConDelay);

});
