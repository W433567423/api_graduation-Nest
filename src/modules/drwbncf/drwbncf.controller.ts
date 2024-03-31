import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DrwbncfService } from './drwbncf.service';

@ApiTags('DRWBNCF')
@Controller('drwbncf')
export class DrwbncfController {
  constructor(private readonly drwbncfService: DrwbncfService) {}
}
