import ioserver from 'socket.io';
import { Reciever, RecieverResponse } from './reciever/Reciever';

const RECIEVER_PIN = 2;

const reciever = new Reciever(RECIEVER_PIN);

const io = ioserver(process.env.PORT || 8090);

reciever.on('data', (tempObj: RecieverResponse) => {
  io.emit('data', tempObj);
});
