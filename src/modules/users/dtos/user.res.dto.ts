import { successResDto } from '@/modules/api-dtos/app.res.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class userResDto {
  @ApiProperty({
    description: '用户id',
    example: 1,
  })
  readonly id: number;

  @ApiProperty({
    description: '用户名',
    example: 'test',
  })
  readonly user: string;

  @ApiProperty({
    description: '密码',
    example: 'f379eaf3c831b04de153469d1bec345e',
  })
  readonly password: string;

  @ApiProperty({
    description: '手机号',
    example: null,
  })
  readonly phone: string | null;

  @ApiProperty({
    description: '邮箱',
    example: null,
  })
  readonly email: string | null;

  @ApiProperty({
    description: '特殊',
    example: null,
  })
  readonly peace: string | null;

  @ApiProperty({
    description: '创建时间',
    example: '2024-03-19T03:21:42.353Z',
  })
  readonly createTime: string;
  @ApiProperty({
    description: '更新时间',
    example: '2024-03-19T03:21:42.353Z',
  })
  readonly updateTime: string;
}
export class userLoginResDto extends successResDto<{
  token: string;
  user: UserEntity;
}> {
  @ApiProperty({
    description: '登录/注册后的token及用户体',
    example: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjcsInVzZXJuYW1lIjoidGVzdDExIiwiaWF0IjoxNzA2NzU0NTc3LCJleHAiOjE3MDY4NDA5Nzd9.nsg7YP1pg5lZztEPZIBuDf137ANfF_q42qTUclXLrCI',
      user: {
        createTime: '2024-03-19T03:21:42.353Z',
        updateTime: '2024-03-19T03:21:42.353Z',
        id: 1,
        username: 'test',
        password: 'f379eaf3c831b04de153469d1bec345e',
        phone: null,
        email: 't433567423@163.com',
        peace: null,
      },
    },
  })
  readonly data: { token: string; user: UserEntity };
}

export class userRegistryAndLoginResDto extends successResDto<string> {
  @ApiProperty({
    description: 'token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjcsInVzZXJuYW1lIjoidGVzdDExIiwiaWF0IjoxNzA2NzU0NTc3LCJleHAiOjE3MDY4NDA5Nzd9.nsg7YP1pg5lZztEPZIBuDf137ANfF_q42qTUclXLrCI',
  })
  readonly data: string;
}
