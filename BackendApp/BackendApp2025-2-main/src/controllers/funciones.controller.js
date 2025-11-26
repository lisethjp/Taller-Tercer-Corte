import connection from "../../lib/db.js";

  export const crearDatos = (req, res, next) => {
    console.log("Crear_Datos:", req.body.nombre);
    //console.log("He ingresado a la funcion crear_Datos!");
    res.status(203).json({ message: req.body.nombre });
    return;
    const sql = `insert into jornada (nombre) values (?)` ;
    const params = ["presencial"];
};


export const consultarDatos = (req, res, next) => {
    console.log("he ingresado a la funcion consultarDatos!");  
  };

  export const eliminarDatos = (req, res, next) => {
    console.log("he ingresado a la funcion eliminarDatos!");  
  };

  export const actualizarDatos = (req, res, next) => {
    console.log("he ingresado a la funcion actualizarDatos!");  
  };
