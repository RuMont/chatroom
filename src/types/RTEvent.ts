import { Prettify } from "./Prettify";

export type RTEvent<T> = Prettify<{
  [key: `[${string}]`]: T;
}>;
