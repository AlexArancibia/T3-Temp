import "dotenv/config";
import { sendMail } from "./mailer";

sendMail(
  "tu_correo@ejemplo.com",
  "Prueba de correo",
  "Este es un correo de prueba desde Bun/Nodemailer",
)
  .then(() => console.log("Correo enviado correctamente"))
  .catch((err) => console.error("Error al enviar correo:", err));
