import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '@/modules/users/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

  async registry(
    username: string,
    password: string,
    valida: string,
    validaServer: string,
  ) {
    // 校验验证码
    if (
      valida.toLocaleLowerCase() !== 'tutu' &&
      valida.toLocaleLowerCase() !== validaServer.toLocaleLowerCase()
    ) {
      throw new HttpException('验证码不正确', HttpStatus.FORBIDDEN);
    }

    // 查询是否已经注册
    const user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      throw new HttpException('该用户名已注册', HttpStatus.FORBIDDEN);
    }

    // 新建用户
    return this.userRepository.save({ username, password });
  }
  // async newUser(username: string, password: string) {}
}
