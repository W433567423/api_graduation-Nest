import { runDrwbncf } from '@/scripts/runDrwbncf';
import { Injectable } from '@nestjs/common';
import { SocketsGateway } from '../sockets/sockets.gateway';

@Injectable()
export class DrwbncfService {
  constructor(private readonly socketsGateway: SocketsGateway) {}
  async run() {
    const cb = this.socketsGateway.sendMessageToClient.bind(
      this.socketsGateway,
    );
    await runDrwbncf(cb);
    return { msg: '代码运行成功', data: true };
  }
}
