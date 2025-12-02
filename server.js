const express = require("express");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const ARCHIVO = path.join(__dirname, "datos.json");

// Crear archivo si no existe
if (!fs.existsSync(ARCHIVO)) {
    fs.writeFileSync(ARCHIVO, "[]");
}

app.post("/solicitud", async (req, res) => {
    console.log("Datos recibidos:", req.body);

    // Guardar datos localmente
    const contenido = JSON.parse(fs.readFileSync(ARCHIVO));
    contenido.push(req.body);
    fs.writeFileSync(ARCHIVO, JSON.stringify(contenido, null, 2));

    // Configuración del correo
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Crear cuerpo del correo
    const mensaje = `
    Nueva encuesta recibida:

    Nombre: ${req.body.nombre}
    Edad: ${req.body.edad}
    Ciudad: ${req.body.ciudad}

    Respuestas:
    P1: ${req.body.p1}
    P2: ${req.body.p2}
    P3: ${req.body.p3}
    `;

    try {
        await transporter.sendMail({
            from: `Encuestas Web <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_DEST,
            subject: "Nueva Encuesta Recibida",
            text: mensaje
        });

        res.json({ mensaje: "Datos enviados y correo enviado con éxito." });
    } catch (error) {
        console.error("Error enviando correo:", error);
        res.status(500).json({ error: "Error enviando el correo." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor activo en puerto", PORT));
