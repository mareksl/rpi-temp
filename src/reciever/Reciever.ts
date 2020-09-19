import rpi433 from 'rpi-433-v3';
import { EventEmitter } from 'events';

import { fromEvent } from 'rxjs';
import {
  map,
  distinctUntilKeyChanged,
  filter,
  bufferToggle,
} from 'rxjs/operators';

interface SnifferResponse {
  code: number;
  pulseLength: number;
}

export interface RecieverResponse {
  temp: number;
  hum: number;
}

export class Reciever extends EventEmitter {
  private readonly CHAR_CODE_TEXT_START = 2;
  private readonly CHAR_CODE_TEXT_END = 3;

  private sniffer: any;

  constructor(private pin: number) {
    super();
    this.sniffer = rpi433.sniffer({
      pin: this.pin,
      debounceDelay: 5,
    });
    this.init();
  }

  private decodeByteNumber = ({ code }: SnifferResponse) => {
    return code >> 8;
  };

  private decodeCharCode = ({ code }: SnifferResponse) => {
    return code & 0xff;
  };

  private tempStringToObject = (tempString: string): RecieverResponse => {
    const [humStr, tempStr] = tempString.split('; ');
    return {
      hum: parseFloat(humStr),
      temp: parseFloat(tempString),
    };
  };

  private init(): void {
    const data$ = fromEvent<SnifferResponse>(this.sniffer, 'data').pipe(
      map((code) => ({
        byteNumber: this.decodeByteNumber(code),
        charCode: this.decodeCharCode(code),
      })),
      distinctUntilKeyChanged('byteNumber'),
    );

    const textStart$ = data$.pipe(
      filter(({ charCode }) => charCode === this.CHAR_CODE_TEXT_START),
    );

    const textEnd$ = data$.pipe(
      filter(({ charCode }) => charCode === this.CHAR_CODE_TEXT_END),
    );

    data$
      .pipe(
        bufferToggle(textStart$, () => textEnd$),
        map((codes) =>
          codes.reduce(
            (result, code) => result.concat(String.fromCharCode(code.charCode)),
            '',
          ),
        ),
      )
      .subscribe((data) => this.emit('data', this.tempStringToObject(data)));
  }
}
