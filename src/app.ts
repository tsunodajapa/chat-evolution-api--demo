import express, { NextFunction, Response, Request } from 'express';
import 'express-async-errors';
import { createServer, Server } from 'http';
import cors from 'cors';
import { Server as Io } from 'socket.io';

import routes from './routes';
import responseError from './errors/middleware/responseError';
import MessagesSocket from './socket/MessagesSocket';

class App {
  public app: express.Application;

  public server: Server;

  private socketIo: Io;

  private connectedUsers: { [key: string]: string }

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.socketIo = new Io(this.server, {
      cors: {
        origin: '*'
      }
    });

    this.connectedUsers = {};

    this.socket();
    this.middlewares();

  }

  private middlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use((request: Request, response: Response, next: NextFunction) => {
      request.io = this.socketIo;
      request.connetctedUsers = this.connectedUsers;

      next();
    });
    this.app.use(routes);
    this.app.use(responseError)
  }

  private socket() {
    this.socketIo.on('connection', socketClient => {
      const idUser = socketClient.handshake.query.id as string;

      this.connectedUsers[idUser] = socketClient.id;

      const messagesSocket = new MessagesSocket(this.socketIo, socketClient);

      messagesSocket.events();

      socketClient.on('disconnect', () => {
        delete this.connectedUsers[idUser]
      })
    });
  }
}

export default App;
