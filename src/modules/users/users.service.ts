import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '@/modules/users/entities/users.entity';
import { eqPassword, eqValida, md5Password } from '@/utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    private jwtService: JwtService,
  ) {}

  // 注册服务
  async registry(
    username: string,
    originPassword: string,
    originValida: string,
    valida: string,
    phoneNum: string,
  ) {
    eqValida(originValida, String(valida));

    // 查询该用户名是否注册
    await this.isExistByName(username, 'registry');

    const password = md5Password(originPassword);
    // 新建用户
    const dbUser = await this.userRepository.save({
      username,
      password,
      phoneNum,
    });

    // 登录
    return await this.jwtService.signAsync({
      id: dbUser.id,
      username: dbUser.username,
    });
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
    const dbUser = (await this.isExistByName(username, 'login')) as UsersEntity;

    // 比较密码
    eqPassword(dbUser.password, md5Password(password));

    // 登录
    return await this.jwtService.signAsync({
      id: dbUser.id,
      username: dbUser.username,
    });
    // return makeToken(dbUser);
  }

  // 用户名查询用户
  async isExistByName(username: string, status: 'login' | 'registry') {
    const user = await this.userRepository.findOne({ where: { username } });
    if (status === 'login' && !user) {
      throw new HttpException('该用户名尚未注册', HttpStatus.FORBIDDEN);
    }
    if (status === 'registry' && user) {
      throw new HttpException('该用户名已被注册', HttpStatus.FORBIDDEN);
    }
    return user;
  }
}
