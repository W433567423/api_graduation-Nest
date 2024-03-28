import { Injectable } from '@nestjs/common';
import { SocketsGateway } from './sockets.gateway';

@Injectable()
export class SocketsService {
  constructor(private readonly socketsGateway: SocketsGateway) {}
}
