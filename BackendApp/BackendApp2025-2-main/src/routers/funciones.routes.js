// src/routers/funciones.routes.js

import { Router } from "express";
import db from "../../lib/db.js";
import { formatoRta } from "../scripts/formatoRta.js";

const router = Router();

/**
 * GET /api/productos
 * Lista todos los productos
 */
router.get("/productos", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM producto ORDER BY id_producto DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al listar productos:", error);
    res.status(500).json({ message: "Error al listar productos" });
  }
});

/**
 * GET /api/proveedores
 * Lista todos los proveedores
 */
router.get("/proveedores", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM proveedor ORDER BY id_proveedor DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al listar proveedores:", error);
    res.status(500).json({ message: "Error al listar proveedores" });
  }
});

/**
 * GET /api/detalle-producto
 * Lista el detalle uniendo las tres tablas
 * Si se pasa ?busqueda=texto, filtra por nombre de producto o referencia
 */
router.get("/detalle-producto", async (req, res) => {
  try {
    const { busqueda } = req.query;

    let sql = `
      SELECT 
        d.id_detalle,
        p.id_producto,
        p.nombre AS producto,
        p.referencia,
        p.valor_unit,
        p.caregoria,
        pr.id_proveedor,
        pr.nombre AS proveedor,
        pr.correo,
        pr.telefono
      FROM detalle_producto d
      INNER JOIN producto p ON d.id_producto = p.id_producto
      INNER JOIN proveedor pr ON d.id_proveedor = pr.id_proveedor
    `;

    const params = [];

    if (busqueda && String(busqueda).trim() !== "") {
      sql += `
        WHERE p.nombre LIKE ? 
           OR p.referencia LIKE ?
      `;
      const like = `%${busqueda}%`;
      params.push(like, like);
    }

    sql += `
      ORDER BY d.id_detalle DESC
    `;

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error("Error al listar detalle_producto:", error);
    res.status(500).json({ message: "Error al listar detalle del producto" });
  }
});

/**
 * POST /api/detalle-producto
 * Inserta producto + proveedor + detalle_producto en una sola transacción
 * Body esperado:
 * {
 *   "producto": { "nombre", "valor_unit", "caregoria", "referencia" },
 *   "proveedor": { "nombre", "direcion", "correo", "telefono" }
 * }
 */
router.post("/detalle-producto", async (req, res) => {
  const { producto, proveedor } = req.body;

  if (!producto || !proveedor) {
    return res
      .status(400)
      .json({ message: "Producto y proveedor son obligatorios en el body" });
  }

  const {
    nombre: nombreProd,
    valor_unit,
    caregoria,
    referencia,
  } = producto;

  const {
    nombre: nombreProv,
    direcion,
    correo,
    telefono,
  } = proveedor;

  if (!nombreProd || !referencia || !nombreProv || !direcion || !correo) {
    return res.status(400).json({
      message:
        "Faltan campos obligatorios. Revisa nombre/referencia del producto y datos principales del proveedor.",
    });
  }

  try {
    await db.beginTransaction();

    // Insertar producto
    const [resultProducto] = await db.query(
      `
      INSERT INTO producto (nombre, valor_unit, caregoria, referencia)
      VALUES (?, ?, ?, ?)
      `,
      [nombreProd, valor_unit ?? 0, caregoria ?? null, referencia]
    );

    const idProducto = resultProducto.insertId;

    // Insertar proveedor
    const [resultProveedor] = await db.query(
      `
      INSERT INTO proveedor (nombre, direcion, correo, telefono)
      VALUES (?, ?, ?, ?)
      `,
      [nombreProv, direcion, correo, telefono ?? null]
    );

    const idProveedor = resultProveedor.insertId;

    // Insertar detalle_producto
    const [resultDetalle] = await db.query(
      `
      INSERT INTO detalle_producto (id_proveedor, id_producto)
      VALUES (?, ?)
      `,
      [idProveedor, idProducto]
    );

    const idDetalle = resultDetalle.insertId;

    await db.commit();

    const respuesta = formatoRta(
      201,
      idDetalle,
      "Detalle de producto creado correctamente"
    );

    res.status(201).json({
      ...respuesta,
      productoId: idProducto,
      proveedorId: idProveedor,
    });
  } catch (error) {
    try {
      await db.rollback();
    } catch (e) {
      console.error("Error al hacer rollback:", e);
    }

    console.error("Error al crear detalle_producto:", error);
    res.status(500).json({
      message: "Error al crear detalle de producto",
      error: error.message,
    });
  }
});

export default router;
