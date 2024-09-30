import { Request, Response, NextFunction } from "express";

export const Methods = {
  ALL: 'all',
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
  PATCH: 'patch',
  OPTIONS: 'options',
  HEAD: 'head'
} as const;
export type Methods = (typeof Methods[keyof typeof Methods]);

export interface Route {
  path: string,
  method: Methods,
  handler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  localMiddleware?: ((
    req: Request,
    res: Response,
    next: NextFunction
  ) => void)[];
}