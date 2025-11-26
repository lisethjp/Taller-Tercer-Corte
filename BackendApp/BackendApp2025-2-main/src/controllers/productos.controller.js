import { formatoRta } from "../scripts/formatoRta.js";

// Almacenamiento temporal en memoria (reemplaza con DB si quieres)
const _productos = []; // [{id, producto, vendedor, detalle, createdAt}]

export const crearProducto = async (req, res) => {
  try {
    const { producto, vendedor, detalle } = req.body;

    const nuevo = {
      id: _productos.length + 1,
      producto,
      vendedor,
      detalle,
      createdAt: new Date().toISOString(),
    };
    _productos.push(nuevo);

    // Si luego usas DB, guarda aquí y cambia idCreado
    const rta = formatoRta(201, nuevo.id, "Producto creado correctamente");
    return res.status(201).json({ ...rta, data: nuevo });
  } catch (err) {
    console.error("Error crearProducto:", err);
    return res.status(500).json({ code: 500, message: "Error interno del servidor" });
  }
};

export const listarProductos = async (req, res) => {
  return res.json({ code: 200, data: _productos });
};
