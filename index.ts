import Server from "./src/server";
import MessageController from "./src/controllers/MessageController";
import ClientController from "./src/controllers/ClientController";
import RoomController from "./src/controllers/RoomController";
import RoomService from "./src/services/RoomService";
import ClientService from "./src/services/ClientService";
import MessageService from "./src/services/MessageService";
import RTController from "./src/controllers/RTController";
import RTService from "./src/services/RTService";

try {
  Server.createInstance({
    port: 3000,
  })
    .inject(RTService, RoomService, ClientService, MessageService)
    .loadControllers(
      RoomController,
      ClientController,
      MessageController,
      RTController
    )
    .listen();
} catch (err) {
  console.log(err);
  process.exit(1);
}

process.on("uncaughtException", (err) => {
  console.log("uncaughtException", err);
  process.exit(1);
});
