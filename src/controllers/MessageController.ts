import { Request, Response } from "express";
import Controller from "../types/Controller";
import { Route } from "../types/Route";
import { CreateMessageDTO } from "../dtos/message/CreateMessageDTO";
import Container from "../di/container";
import MessageService from "../services/MessageService";

export default class MessageController extends Controller {
  public path: string = "/messages";
  protected routes: Route[] = [
    {
      path: "/",
      method: "get",
      handler: this.get,
    },
    {
      path: "/room/:roomId",
      method: "get",
      handler: this.getFromRoom,
    },
    {
      path: "/create",
      method: "post",
      handler: this.create,
    },
    {
      path: "/delete/:id",
      method: "delete",
      handler: this.delete,
    },
  ];

  private readonly messageService;

  constructor() {
    super();
    this.messageService = Container.get(MessageService);
  }

  public get(req: Request, res: Response) {
    try {
      const messages = this.messageService.get();
      this.sendSuccess(res, messages);
    } catch (error) {
      this.sendServerError(res, error + "");
    }
  }

  public async getFromRoom(req: Request, res: Response) {
    try {
      const messageId = req.params.id;
      if (!messageId || typeof messageId !== "string") {
        this.sendClientError(
          res,
          "'roomId' route param is mandatory and must be in UUID format. Eg: /route/<uuid>",
          400
        );
        return;
      }
      const messages = await this.messageService.getFromRoom(messageId);
      this.sendSuccess(res, messages);
    } catch (error) {
      this.sendServerError(res, error + "");
    }
  }

  public async create(req: Request<{}, {}, CreateMessageDTO>, res: Response) {
    try {
      const dto = req.body;
      const result = await this.messageService.create(dto);
      this.sendSuccess(res, result);
    } catch (error) {
      this.sendServerError(res, error + "");
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const messageId = req.params.id;
      if (!messageId || typeof messageId !== "string") {
        this.sendClientError(
          res,
          "'id' route param is mandatory and must be in UUID format. Eg: /route/<uuid>",
          400
        );
        return;
      }
      const result = await this.messageService.delete(messageId);
      this.sendSuccess(res, { affected: result.changes });
    } catch (error) {
      this.sendServerError(res, error + "");
    }
  }
}
