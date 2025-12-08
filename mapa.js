let mapa;
let marcador;

function mostrarMapa(lat, lng) {
  if (!mapa) {
    mapa = L.map('map').setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(mapa);
  }

  if (marcador) marcador.remove();

  marcador = L.marker([lat, lng]).addTo(mapa);
}

const inputDireccion = document.getElementById("direccion");
const mapaDiv = document.getElementById("map");

let delay;

inputDireccion.addEventListener("input", () => {
  clearTimeout(delay);

  delay = setTimeout(() => {
    const direccion = inputDireccion.value.trim();
    if (direccion.length < 5) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion + ", Colombia")}`)
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) return;

        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        mapaDiv.style.display = "block";
        mostrarMapa(lat, lon);
      });
  }, 700);
});
