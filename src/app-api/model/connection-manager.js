const mongoose = require("mongoose");
const readLine = require("readline");
const utils = require("../../utils/logger")

require("./chapter");
require("./story");

const MONGO_DEFAULT_URL = "mongodb://localhost/database";
const dbURI = process.env.MONGODB_URL || MONGO_DEFAULT_URL;

/*
if (process.env.APP_ENV === "dev") {
  dbURI = MONGO_DEFAULT_URL; // conexion a la DB Remota
}
*/

mongoose.connect(dbURI, { useNewUrlParser: true }).then(() => {
    utils.logger.info('Mongoose db connection done!');
  })
  .catch((err) => {
    utils.logger.error('Mongoose db connection error...\n' + err);
  });

// Uso de readLine
if (process.platform === "win32") {
  const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.on("SIGINT", () => {
    process.emit("SIGINT");
  });
}

// Funcion para cerrar la conexion a la DB
const procShutdown = (msg, callback) => {
  mongoose.connection.close(() => {
    utils.logger.info(`Mongoose desconectado debido a ${msg}`);
    callback();
  });
};

// LLamadas a procShutdown dependiendo de los eventos escuchados
// - windows: SIGINT
process.on("SIGINT", () => {
  procShutdown("terminacion de la app por windows", () => {
    process.exit(0);
  });
});
// - node: SIGUSR2
process.once("SIGUSR2", () => {
  procShutdown("reinicio de nodemon", () => {
    process.kill(process.pid, "SIGUSR2");
  });
});
// - heroku: SIGTERM
process.on("SIGTERM", () => {
  procShutdown("terminacion de la app por heroku", () => {
    process.exit(0);
  });
});

//Monitoreo de eventos a DB 1
//Conexion Mongoose
mongoose.connection.on("connected", () => {
    utils.logger.info(`Mongoose se conectó a: ${dbURI}`);
});

//Error de conexión
mongoose.connection.on("error", (err) => {
    utils.logger.info("Mongoose error de conexión: ", err);
});
