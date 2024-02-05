import { ApiProperty } from '@nestjs/swagger';
import { successResDto } from '@/modules/api-dtos/app.res.dto';
import type { IResData } from '../../index';
import type { IGetListRes } from '../index';

export class getListResDto extends successResDto<any> {
  @ApiProperty({
    description: '项目列表和总数',
    example: { list: [], total: 0 },
  })
  readonly data: IResData<IGetListRes>;
}
