import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DatabaseSeeder } from './database.seeder';

@Global()
@Module({
  providers: [PrismaService, DatabaseSeeder],
  exports: [PrismaService],
})
export class PrismaModule {}
