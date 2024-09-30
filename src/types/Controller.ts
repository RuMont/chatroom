import { Router, Response } from "express";
import { Route } from "./Route";

export default abstract class Controller {
  public router: Router = Router();
  public abstract path: string;
  protected abstract readonly routes: Route[];

  public setRoutes = (): Router => {
    for (const route of this.routes) {
      try {
        for (const middleware of (route.localMiddleware ?? [])) {
          this.router[route.method](route.path, middleware);
        }

        this.router[route.method](route.path, route.handler.bind(this));
      } catch (err) {
        throw `Error in src/types/Controller.ts: ${err}`;
      }
    }
    return this.router;
  }

  protected sendSuccess<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = 200
  ): Response {
    return res.status(statusCode).json({
      message: message || 'success',
      data: data,
    });
  }

  protected sendClientError(
    res: Response,
    message?: string,
    status: 400 | 401 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 415 = 400,
  ): Response {
    return res.status(status).json({
      message: message || 'bad request'
    })
  }

  protected sendServerError(
    res: Response,
    message?: string,
    status: 500 | 501 | 502 | 503 | 504 | 505 = 500
  ): Response {
    return res.status(status).json({
      message: message || 'internal server error'
    })
  }
}