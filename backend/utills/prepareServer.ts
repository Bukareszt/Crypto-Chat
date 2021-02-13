import express from 'express';
import http from 'http';
import { ChatHandler } from '../sockets/SocketHandler';

export default function prepareServer(app: express.Application): http.Server {
  const server = http.createServer(app);

  const ioConnection = new ChatHandler(server);

  return server;
}
