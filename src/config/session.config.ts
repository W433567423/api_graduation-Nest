import * as session from 'express-session';
import { RequestHandler } from '@nestjs/common/interfaces';
export const SERVER_PORT = 8004;
export const sessionConfig: RequestHandler = session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: false,
});
