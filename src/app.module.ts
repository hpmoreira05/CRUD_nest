import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { CrudModule } from './crud/crud.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, CrudModule, UsersModule],
})
export class AppModule {}
