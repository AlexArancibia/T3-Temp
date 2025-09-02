import { requireAuth } from "@backend/middlewares/requireAuth";
import type { AuthenticatedRequest } from "@backend/types/request";
import type { ApiResponse } from "@backend/types/response";
import { validateEmail } from "@backend/utils/validate";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userHandler = async (
  req: AuthenticatedRequest,
  res: ApiResponse,
): Promise<void> => {
  try {
    switch (req.method) {
      case "GET": {
        // ...existing code...
        const { id } = req.query;
        if (id) {
          const user = await prisma.user.findUnique({
            where: { id: String(id) },
          });
          if (!user) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return;
          }
          res.status(200).json(user);
          return;
        }
        const users = await prisma.user.findMany({
          select: { id: true, email: true, name: true, isConfirmed: true },
        });
        res.status(200).json(users);
        return;
      }
      case "POST": {
        // ...existing code...
        const { email, password, name, lastname, phone } = req.body;
        if (!validateEmail(email)) {
          res.status(400).json({ error: "Email inválido" });
          return;
        }
        // Validación avanzada de contraseña
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}:;"'<>?,.]).{8,}$/;
        if (!passwordRegex.test(password)) {
          res.status(400).json({
            error:
              "La contraseña debe tener mínimo 8 caracteres, mayúsculas, minúsculas, números y caracteres especiales.",
          });
          return;
        }
        // Validar campos extra
        if (!name || !lastname || !phone) {
          res.status(400).json({ error: "Todos los campos son obligatorios." });
          return;
        }
        // Sanitizar inputs básicos
        const safeName = String(name).replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
        const safeLastname = String(lastname).replace(
          /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
          "",
        );
        const safePhone = String(phone).replace(/[^\d+]/g, "");
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) {
          res.status(409).json({ error: "Email ya registrado" });
          return;
        }
        const hashed = await import("bcryptjs").then((b) =>
          b.default.hash(password, 10),
        );
        const user = await prisma.user.create({
          data: {
            email,
            password: hashed,
            name: safeName,
            lastname: safeLastname,
            phone: safePhone,
            isConfirmed: false,
          },
          select: {
            id: true,
            email: true,
            name: true,
            lastname: true,
            phone: true,
          },
        });
        res.status(201).json(user);
        return;
      }
      case "PUT": {
        // ...existing code...
        const { id } = req.query;
        const { name, email } = req.body;
        if (!id) {
          res.status(400).json({ error: "ID requerido" });
          return;
        }
        const user = await prisma.user.findUnique({
          where: { id: String(id) },
        });
        if (!user) {
          res.status(404).json({ error: "Usuario no encontrado" });
          return;
        }
        // Validar email si se actualiza
        if (email && !validateEmail(email)) {
          res.status(400).json({ error: "Email inválido" });
          return;
        }
        const updated = await prisma.user.update({
          where: { id: String(id) },
          data: { name, email },
        });
        res
          .status(200)
          .json({ id: updated.id, email: updated.email, name: updated.name });
        return;
      }
      case "DELETE": {
        // ...existing code...
        const { id } = req.query;
        if (!id) {
          res.status(400).json({ error: "ID requerido" });
          return;
        }
        const user = await prisma.user.findUnique({
          where: { id: String(id) },
        });
        if (!user) {
          res.status(404).json({ error: "Usuario no encontrado" });
          return;
        }
        await prisma.user.delete({ where: { id: String(id) } });
        res.status(204).end();
        return;
      }
      default: {
        res.status(405).json({ error: "Método no permitido" });
        return;
      }
    }
  } catch (err: unknown) {
    const message =
      typeof err === "object" && err !== null && "message" in err
        ? (err as { message?: string }).message
        : "Error interno del servidor";
    res
      .status(500)
      .json({ error: "Error interno del servidor", details: message });
  }
};

export default requireAuth(userHandler);
