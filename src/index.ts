import rpi433 from 'rpi-433-v3';

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

const CHAR_CODE_TEXT_START = 2;
const CHAR_CODE_TEXT_END = 3;

const RECIEVER_PIN = 2;

const rfSniffer = rpi433.sniffer({
  pin: RECIEVER_PIN,
  debounceDelay: 5,
});

const decodeByteNumber = ({ code }: SnifferResponse) => {
  return code >> 8;
};

const decodeCharCode = ({ code }: SnifferResponse) => {
  return code & 0xff;
};

(function () {
  const data$ = fromEvent<SnifferResponse>(rfSniffer, 'data').pipe(
    map((code) => ({
      byteNumber: decodeByteNumber(code),
      charCode: decodeCharCode(code),
    })),
    distinctUntilKeyChanged('byteNumber'),
  );

  const textStart$ = data$.pipe(
    filter(({ charCode }) => charCode === CHAR_CODE_TEXT_START),
  );

  const textEnd$ = data$.pipe(
    filter(({ charCode }) => charCode === CHAR_CODE_TEXT_END),
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
    .subscribe((data) => console.log(new Date().toISOString(), data));
})();
