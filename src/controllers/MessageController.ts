import { Request, Response } from "express";
import Controller from "../types/Controller";
import { Route } from "../types/Route";
import { CreateMessageDTO } from "../dtos/message/CreateMessageDTO";
import { UpdateMessageDTO } from "../dtos/message/UpdateMessageDTO";

export default class MessageController extends Controller {
  public path: string = "/messages";
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

  constructor() {
    super();
  }

  public get(req: Request, res: Response) {}

  public getById(req: Request, res: Response) {}

  public create(req: Request<{}, {}, CreateMessageDTO>, res: Response) {}

  public update(req: Request<{}, {}, UpdateMessageDTO>, res: Response) {}

  public delete(req: Request, res: Response) {}
}
