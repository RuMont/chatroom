import { NextFunction, Request, Response } from "express";
import Controller from "../types/Controller";
import { Route } from "../types/Route";
import ClientService from "../services/ClientService";
import Container from "../di/container";
import { CreateClientDTO } from "../dtos/client/CreateClientDTO";
import { UpdateClientDTO } from "../dtos/client/UpdateClientDTO";

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
      path: "/delete/:id",
      method: "delete",
      handler: this.delete,
    },
  ];

  private readonly clientService;

  constructor() {
    super();
    this.clientService = Container.get(ClientService);
  }

  public async get(req: Request, res: Response) {
    try {
      const clients = await this.clientService.get();
      this.sendSuccess(res, clients);
    } catch (error) {
      this.sendServerError(res, error + "");
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const clientId = req.params.id;
      if (!clientId || typeof clientId !== "string") {
        this.sendClientError(
          res,
          "'id' route param is mandatory and must be in UUID format. Eg: /route/<uuid>",
          400
        );
        return;
      }
      const client = await this.clientService.getById(clientId);
      this.sendSuccess(res, client);
    } catch (error) {
      this.sendServerError(res, error + "");
    }
  }

  public async create(req: Request<{}, {}, CreateClientDTO>, res: Response) {
    try {
      const dto = req.body;
      const result = await this.clientService.create(dto);
      this.sendSuccess(res, result);
    } catch (error) {
      this.sendServerError(res, error + "");
    }
  }

  public async update(req: Request<{}, {}, UpdateClientDTO>, res: Response) {
    try {
      const dto = req.body;
      const result = await this.clientService.update(dto);
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
      const clientId = req.params.id;
      if (!clientId || typeof clientId !== "string") {
        this.sendClientError(
          res,
          "'id' route param is mandatory and must be in UUID format. Eg: /route/<uuid>",
          400
        );
        return;
      }
      const result = await this.clientService.delete(clientId);
      this.sendSuccess(res, { affected: result.changes });
    } catch (error) {
      this.sendServerError(res, error + "");
    }
  }
}
