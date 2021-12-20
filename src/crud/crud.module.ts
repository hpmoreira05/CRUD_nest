import { Module } from '@nestjs/common';
import { CrudService } from './providers/crud.service';
import { CrudController } from './controllers/crud.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [CrudController],
  providers: [CrudService, PrismaService],
})
export class CrudModule {}
