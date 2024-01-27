import * as session from 'express-session';
import { RequestHandler } from '@nestjs/common/interfaces';

export const sessionConfig: RequestHandler = session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: false,
});
