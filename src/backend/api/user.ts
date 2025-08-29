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
  switch (req.method) {
    case "GET": {
      // Listar todos los usuarios o uno por ID
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
      // Crear usuario avanzado (validación, email único, etc)
      const { email, password, name } = req.body;
      if (!validateEmail(email)) {
        res.status(400).json({ error: "Email inválido" });
        return;
      }
      const exists = await prisma.user.findUnique({ where: { email } });
      if (exists) {
        res.status(409).json({ error: "Email ya registrado" });
        return;
      }
      // Aquí podrías agregar validaciones de password, roles, etc
      const hashed = await import("bcryptjs").then((b) =>
        b.default.hash(password, 10),
      );
      const user = await prisma.user.create({
        data: { email, password: hashed, name, isConfirmed: false },
      });
      res.status(201).json({ id: user.id, email: user.email, name: user.name });
      return;
    }
    case "PUT": {
      // Actualizar usuario (solo campos permitidos)
      const { id } = req.query;
      const { name, email } = req.body;
      if (!id) {
        res.status(400).json({ error: "ID requerido" });
        return;
      }
      const user = await prisma.user.findUnique({ where: { id: String(id) } });
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
      // Eliminar usuario
      const { id } = req.query;
      if (!id) {
        res.status(400).json({ error: "ID requerido" });
        return;
      }
      const user = await prisma.user.findUnique({ where: { id: String(id) } });
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
};

export default requireAuth(userHandler);
