import { NextFunction, Request, Response } from "express";
import Controller from "../types/Controller";
import { Route } from "../types/Route";
import EventService from "../services/EventService";
import Container from "../di/container";

// El controlador y el servicio comparten mucha responsabilidad por la propia lógica
export default class EventController extends Controller {
  public path: string = "/event";
  protected routes: Route[] = [
    {
      path: "/subscribe",
      method: "post",
      handler: this.subscribe,
    },
  ];

  private readonly eventService: EventService;

  constructor() {
    super();
    this.eventService = Container.get(EventService);
  }

  public async subscribe(req: Request, res: Response) {
    try {
      await this.eventService.subscribe(req.body, req, res);
    } catch (error) {
      this.eventService.unsubscribe(res, error + "", 401);
    }
  }
}
