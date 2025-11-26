//import { MongoLib } from "./lib/mongo.js"; 
import app from "./app.js";
import { PORT } from "./config.js";

//const mongoDB = new MongoLib();

app.listen(PORT, () => {
  console.log("Servidor corriendo en el puerto: ", PORT);
});

//mongoDB.connect(); 
