import { NextFunction, Request, Response } from "express";
import Controller from "../types/Controller";
import { Route } from "../types/Route";

export default class ClientController extends Controller {
  public path: string = "/clients";
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
      path: "/delete",
      method: "delete",
      handler: this.delete,
    },
  ];

  constructor() {
    super();
  }

  public get(req: Request, res: Response, next: NextFunction) {}

  public getById(req: Request, res: Response, next: NextFunction) {}

  public create(req: Request, res: Response, next: NextFunction) {}

  public update(req: Request, res: Response, next: NextFunction) {}

  public delete(req: Request, res: Response, next: NextFunction) {}
}
