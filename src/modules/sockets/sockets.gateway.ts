import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class SocketsGateway {
  // 直接访问原生的、特定于平台的服务器实例
  @WebSocketServer() server: Server;

  @SubscribeMessage('runCode')
  handleGetListenMessage(@MessageBody() data: string) {
    return data;
  }
  // @ConnectedSocket() client: Socket,

  @SubscribeMessage('runCode')
  handleSendMessage(@MessageBody() data: string) {
    console.log('🚀 ~ SocketsGateway 发送:', data);
    this.server.emit('runCode', data);
    // client.emit('runCode', data);
    return data;
  }
}
