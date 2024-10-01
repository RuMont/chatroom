import { Prettify } from "./Prettify";

export type AppEvent<T> = Prettify<{
  [key: `[${string}]`]: T;
}>;
