import { WebSocketGateway, WebSocketServer, OnGatewayConnection, MessageBody, SubscribeMessage, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    // Expect vendorId in query params to join room
    const { vendorId } = client.handshake.query;
    if (vendorId) client.join(vendorId as string);
  }

  notifyOrderUpdate(vendorId: string, payload: any) {
    this.server.to(vendorId).emit('order:update', payload);
  }
}