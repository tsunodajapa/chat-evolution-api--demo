import * as IoSocket from 'socket.io';

class MessagesSocket {
  private io: IoSocket.Server;
  private client: IoSocket.Socket;

  constructor(io: IoSocket.Server, client: IoSocket.Socket) {
    this.io = io;
    this.client = client;
  }

  public events() {
    this.client.on('messages', (msg: string) => {
      this.client.broadcast.emit('messages', msg);
    });
  }
}

export default MessagesSocket;
