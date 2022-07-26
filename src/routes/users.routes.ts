import { Router, Response, Request } from 'express';

const usersRouter = Router();

usersRouter.get('/:idUser', (request: Request, response: Response) => {
  const { io, connetctedUsers } = request;
  const { idUser } = request.params;

  if (connetctedUsers[idUser]) {
    io.to(connetctedUsers[idUser]).emit('notifications', 'Nova notificação');
  }

  return response.json({ ok: true });
});

export default usersRouter;
