import express from "express";
import cors from "cors";
import functionRoutes from "./src/routers/funciones.routes.js";

const app = express();

// Habilitar CORS para que el frontend (Expo/React Native) pueda consumir la API
app.use(cors({ origin: "*" }));

// Parsear JSON del body
app.use(express.json());

// Rutas principales bajo /api
app.use("/api", functionRoutes);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  console.log("Petición a ruta no encontrada:", req.method, req.originalUrl);
  res.status(404).json({ message: "Ruta no encontrada..." });
});

export default app;
