import { Classname } from "../types/Classname";

/**
 * Dependency Injection container
 */
export default class Container {
  private static instance: Container;
  private static tokens: Map<string, object> = new Map();

  private constructor() {}

  /**
   * Creates the DI container if its not created, otherwise it returns the instanced container
   * @returns the initialized instance
   */
  static create() {
    if (!this.instance) this.instance = new Container();
    return this;
  }

  /**
   * Adds an instance to the DI container
   * @example
   * class Car {
   *  run() {
   *    console.log('run') 
   *  }
   * }
   * 
   * Container.add(Car);
   * @param injection name of the class as type, not string
   */
  static add(injection: Classname<any>) {
    const token = injection.name;
    const ref = new injection();
    this.tokens.set(token, ref);
  }
  
  /**
   * Gets a class instance by its class name type
   * @example
   * class Car {
   *  run() {
   *    console.log('run') 
   *  }
   * }
   * 
   * Container.add(Car);
   * const car = Container.get(Car);
   * car.run();
   * @param token name of the class as type, not string
   * @returns object of that token class
  */
 static get<T>(token: Classname<T>) {
    const reference = this.tokens.get(token.name);
    if (!reference) throw Error(`${token} reference not found`);
    return reference as T;
  }
}