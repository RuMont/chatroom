import { Request, Response } from "express";
import Controller from "../types/Controller";
import { Route } from "../types/Route";
import Container from "../di/container";
import RoomService from "../services/RoomService";
import { CreateRoomDTO } from "../dtos/room/CreateRoomDTO";
import { UpdateRoomDTO } from "../dtos/room/UpdateRoomDTO";

export default class RoomController extends Controller {
  public path: string = "/rooms";
  protected routes: Route[] = [
    {
      path: "/",
      method: "get",
      handler: this.get,
    },
    {
      path: "/:id",
      method: "get",
      handler: this.getById,
    },
    {
      path: "/create",
      method: "post",
      handler: this.create,
    },
    {
      path: "/update",
      method: "put",
      handler: this.update,
    },
    {
      path: "/delete/:id",
      method: "delete",
      handler: this.delete,
    },
  ];

  private roomService;

  constructor() {
    super();
    this.roomService = Container.get(RoomService);
  }

  public async get(req: Request, res: Response) {
    try {
      const rooms = await this.roomService.get();
      this.sendSuccess(res, rooms);
    } catch (error) {
      this.sendServerError(res, error + "");
    }
  }

  public async getById(req: Request, res: Response) {
    try {
      const roomId = req.params.id;
      if (!roomId || typeof roomId !== "string") {
        this.sendClientError(
          res,
          "'id' route param is mandatory and must be in UUID format. Eg: /route/<uuid>",
          400
        );
        return;
      }
      const room = await this.roomService.getById(roomId);
      this.sendSuccess(res, room);
    } catch (error) {
      this.sendServerError(res, error + "");
    }
  }

  public async create(req: Request<{}, {}, CreateRoomDTO>, res: Response) {
    try {
      const dto = req.body;
      const result = await this.roomService.create(dto);
      this.sendSuccess(res, result);
    } catch (error) {
      this.sendServerError(res, error + "");
    }
  }

  public async update(req: Request<{}, {}, UpdateRoomDTO>, res: Response) {
    try {
      const dto = req.body;
      const result = await this.roomService.update(dto);
      if (result) {
        this.sendSuccess(res, result);
      } else {
        this.sendClientError(res, "id not found", 404);
      }
    } catch (error) {
      this.sendServerError(res, error + "");
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const roomId = req.params.id;
      if (!roomId || typeof roomId !== "string") {
        this.sendClientError(
          res,
          "'id' route param is mandatory and must be in UUID format. Eg: /route/<uuid>",
          400
        );
        return;
      }
      const result = await this.roomService.delete(roomId);
      this.sendSuccess(res, { affected: result.changes });
    } catch (error) {
      this.sendServerError(res, error + "");
    }
  }
}
