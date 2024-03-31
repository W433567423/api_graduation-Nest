import { PartialType } from '@nestjs/swagger';
import { CreateDrwbncfDto } from './create-drwbncf.dto';

export class UpdateDrwbncfDto extends PartialType(CreateDrwbncfDto) {}
