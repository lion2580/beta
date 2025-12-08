/**
 * server.js - implementacion robusta
 * - guarda en datos.json
 * - intenta enviar correo si hay ENV vars (EMAIL_USER, EMAIL_PASS, EMAIL_DEST)
 * - preparado para Railway/Render (usa process.env.PORT)
 */

const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

// seguridad basica y limits
app.use(express.json({ limit: "200kb" }));
app.use(express.static(path.join(__dirname)));

const ARCHIVO = path.join(__dirname, "datos.json");

// crear archivo si no existe (sync inicial)
(async () => {
  try {
    await fs.access(ARCHIVO);
  } catch {
    await fs.writeFile(ARCHIVO, "[]", "utf8");
  }
})();

// util: escribir archivo de forma atomica
async function appendToJsonFile(filePath, obj){
  const raw = await fs.readFile(filePath, "utf8");
  const arr = JSON.parse(raw || "[]");
  arr.push(obj);
  await fs.writeFile(filePath, JSON.stringify(arr, null, 2), "utf8");
}

// prepare transporter solo si vars estan definidas
function getTransporterIfConfigured(){
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if(!user || !pass) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass }
  });
}

app.post("/solicitud", async (req, res) => {
  try {
    const datos = req.body;
    // validacion basica
    if(!datos || !datos.nombre || !datos.motivo){
      return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }

    datos.recibidoEn = new Date().toISOString();

    // guardar en archivo
    await appendToJsonFile(ARCHIVO, datos);

    // intentar enviar correo si hay configuracion
    const transporter = getTransporterIfConfigured();
    if(transporter){
      const destino = process.env.EMAIL_DEST || process.env.EMAIL_USER;
      const texto = `
Nueva solicitud recibida:

Usuario: ${datos.usuario || "Invitado"}
Nombre: ${datos.nombre}
Motivo: ${datos.motivo}
Ciudad: ${datos.ciudad || "-"}
Día: ${datos.dia || "-"}  Hora: ${datos.hora || "-"}

Urgencia: ${datos.urgencia || "-"}
Amenaza: ${datos.amenaza || "-"}
Armado: ${datos.armado || "-"}
Vehículo: ${datos.vehiculo || "-"}
Personas: ${datos.personas || "-"}
Duración: ${datos.duracion || "-"}h
Dirección: ${datos.direccion || "-"}

Precio estimado: ${datos.precioEstimado || "-"}
Recibido en: ${datos.recibidoEn}
      `;

      try {
        await transporter.sendMail({
          from: `Encuestas Web <${process.env.EMAIL_USER}>`,
          to: destino,
          subject: "Nueva Solicitud de Escolta",
          text: texto
        });
        console.log("Correo enviado a", destino);
      } catch (mailErr) {
        console.error("Fallo al enviar correo:", mailErr);
      }
    } else {
      console.log("No se envió correo (EMAIL_USER/PASS no configurados)");
    }

    return res.json({ mensaje: "Datos recibidos y guardados." });

  } catch (err){
    console.error("Error en /solicitud:", err);
    return res.status(500).json({ mensaje: "Error interno del servidor." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo → http://localhost:${PORT}`));
