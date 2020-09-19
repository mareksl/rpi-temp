export = Sniffer;
declare function Sniffer(options: any): void;
declare class Sniffer {
  constructor(options: any);
  onError(error: any): void;
  onData(buffer: any): void;
}
declare namespace Sniffer {
  const SCRIPT: string;
  const process: any;
  const instance: any;
  function getInstance(options: any): any;
}
