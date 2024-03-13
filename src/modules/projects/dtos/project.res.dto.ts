import { successResDto } from '@/modules/api-dtos/app.res.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import type { IResData } from '../../index';
import type { IGetListRes } from '../index';

export class getListResDto extends successResDto<any> {
  @ApiProperty({
    description: '项目列表和总数',
    example: { list: [], total: 0 },
  })
  @IsNotEmpty({ message: '项目名称不能为空' })
  readonly data: IResData<IGetListRes>;
}

export class getProjectCodeResDto {
  @ApiProperty({
    description: '项目名称',
    example: 'test',
  })
  projectName?: string;

  @ApiProperty({
    description: '项目代码',
    example: 'node code',
  })
  code: string;
}
