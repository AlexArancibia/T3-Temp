// Tipos para respuesta extendida
import type { NextApiResponse } from "next";

export interface ApiResponse<T = unknown> extends NextApiResponse {
  json: (body: T) => void;
}
