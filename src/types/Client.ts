import { Response } from "express";

export type Client = {
  id: string;
  name: string;
  connection?: Response;
}