import { UserEntity } from '@/modules/users/entities/user.entity';
import {
  eqPassword,
  eqValidNumber,
  eqValidString,
  md5Password,
} from '@/utils/handlePassword';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IReqUser } from '..';
import { AvatarsEntity } from '../file/entities/avatar.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @Inject(REQUEST) private readonly request: IReqUser,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private jwtService: JwtService,
  ) {}

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

  // 注册服务
  async registry(
    username: string,
    originPassword: string,
    emailValid: string,
    validServer: number,
    email: string,
  ) {
    eqValidNumber(Number(emailValid), validServer);

    // 查询该用户名是否注册
    await this.isExistByName(username, 'registry');

    const password = md5Password(originPassword);
    // 新建用户
    const dbUser = await this.userRepository.save({
      username,
      password,
      email,
    });

    // 登录
    return {
      user: dbUser,
      token: await this.jwtService.signAsync({
        id: dbUser.id,
        username: dbUser.username,
      }),
    };
  }

  // 登录服务
  async login(
    username: string,
    password: string,
    codeValid: string,
    validServer: string,
  ) {
    eqValidString(codeValid, validServer);

    // 查询该用户名是否注册
    const dbUser = (await this.isExistByName(username, 'login')) as UserEntity;

    // 比较密码
    eqPassword(dbUser.password, md5Password(password));

    // 登录
    return {
      user: dbUser,
      token: await this.jwtService.signAsync({
        id: dbUser.id,
        username: dbUser.username,
      }),
    };
    // return makeToken(dbUser);
  }

  // 忘记密码
  async forget(
    email: string,
    newPassword: string,
    emailValid: string,
    validServer: number,
  ) {
    eqValidNumber(Number(emailValid), validServer);

    // 查询该用户名是否注册
    const dbUser = await this.userRepository.findOne({
      where: { email },
    });

    if (!dbUser) {
      throw new HttpException('该邮箱尚未被绑定', HttpStatus.FORBIDDEN);
    } else {
      this.userRepository.update(dbUser.id, {
        password: md5Password(newPassword),
      });
    }
  }

  // 获取用户
  async getUser() {
    if (!this.request.user?.id) {
      console.log('用户id不存在');
      throw new HttpException('未登录', HttpStatus.UNAUTHORIZED);
    }
    const user = await this.userRepository.findOneBy({
      id: this.request.user?.id,
    });
    if (!user) {
      // 理论上不可能
      console.log('找不到用户');
      throw new HttpException('该用户名不存在', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  // 更新用户头像
  async updateUserAvatar(avatar: AvatarsEntity) {
    const userId = this.request.user!.id;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['avatar'],
    });
    user!.avatar = avatar;
    return this.userRepository.update(userId, user!);
  }

  // 更新用户平安Cookie
  async updatePeaceCookie(cookie: string) {
    const user = await this.getUser();
    user.peace = cookie;
    return this.userRepository.update(user.id, user);
  }
}
