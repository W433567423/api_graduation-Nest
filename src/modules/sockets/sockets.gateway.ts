import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8014, { cors: { origin: '*' } })
export class SocketsGateway {
  // 直接访问原生的、特定于平台的服务器实例
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('runCode')
  handleGetMessage(@MessageBody() body: string) {
    console.log('🚀 ~ 服务器订阅到消息 ~', body);
    this.server.local.emit('runCode', `{ msg: 'server send' }`);
    return 'ok';
  }

  sendMessageToClient(msg: any) {
    console.log('🚀 ~ 主动发消息 ~', msg);
    this.server.local.emit('runCode', msg);
  }
  handleConnection(client: Socket) {
    console.log('🚀 ~ 有人上线了 ~', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('🚀 ~ 有人下线了 ~' + client.id);
  }
}
