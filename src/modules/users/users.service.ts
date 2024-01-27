import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '@/modules/users/users.entity';
import { eqValida, md5Password } from '@/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

  // 注册服务
  async registry(
    username: string,
    originPassword: string,
    originValida: string,
    valida: string,
  ) {
    eqValida(originValida, valida);

    // 查询该用户名是否注册
    await this.isExistByName(username);

    const password = md5Password(originPassword);
    // 新建用户
    return this.userRepository.save({ username, password });
  }

  // 登录服务
  async login(
    username: string,
    password: string,
    originValida: string,
    valida: string,
  ) {
    eqValida(originValida, valida);

    // 查询该用户名是否注册
    const user = await this.isExistByName(username);

    // 登录
    console.log(user.password, md5Password(password));

    return 'payload';
  }

  // 如果用户名查询用户
  async isExistByName(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new HttpException('该用户名尚未注册', HttpStatus.FORBIDDEN);
    }
    return user;
  }
}
