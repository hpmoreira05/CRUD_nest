import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCrudDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  content?: string;

  @IsBoolean()
  published?: boolean;
}
