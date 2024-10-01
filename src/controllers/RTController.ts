import { NextFunction, Request, Response } from "express";
import Controller from "../types/Controller";
import { Route } from "../types/Route";
import RTService from "../services/RTService";
import Container from "../di/container";

export default class RTController extends Controller {
  public path: string = "/rt";
  protected routes: Route[] = [
    {
      path: "/subscribe",
      method: "post",
      handler: this.subscribe,
    },
  ];

  private readonly rtService: RTService;

  constructor() {
    super();
    this.rtService = Container.get(RTService);
  }

  public async subscribe(req: Request, res: Response, next: NextFunction) {
    try {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
      });
      await this.rtService.subscribe(req.body, req, res);
    } catch (error) {
      this.sendServerError(res, error + "");
    }
  }
}
