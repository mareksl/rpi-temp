export = Emitter;
declare function Emitter(options: any): void;
declare class Emitter {
  constructor(options: any);
  options: any;
  sendCode(code: any, options?: any, callback?: any, ...args: any[]): any;
}
declare namespace Emitter {
  const SCRIPT: string;
}
