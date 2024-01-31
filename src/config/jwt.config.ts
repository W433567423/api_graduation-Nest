import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';

export const jwtSecret = 'tutu is the author';
export const jwtConfig: JwtModuleOptions = {
  global: true,
  secret: jwtSecret,
  signOptions: { expiresIn: '24h' },
};
