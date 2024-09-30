import Server from "./src/server";
import MessageController from "./src/controllers/MessageController";
import ClientController from "./src/controllers/ClientController";
import RoomController from "./src/controllers/RoomController";
import RoomService from "./src/services/RoomService";

try {
  Server.createInstance({
    port: 3000,
  })
    .inject(RoomService)
    .loadControllers(RoomController, ClientController, MessageController)
    .listen();
} catch (err) {
  console.log(err);
  process.exit(1);
}

process.on("uncaughtException", (err) => {
  console.log("uncaughtException", err);
  process.exit(1);
});
