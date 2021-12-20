import { Injectable } from '@nestjs/common';
import { Publications, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CrudService {
  constructor(private prisma: PrismaService) {}

  async create(params: Prisma.PublicationsCreateArgs): Promise<Publications> {
    return await this.prisma.publications.create(params);
  }

  async findMany(
    params: Prisma.PublicationsFindManyArgs,
  ): Promise<Publications[]> {
    return await this.prisma.publications.findMany(params);
  }

  async findUnique(id: number): Promise<Publications> {
    return await this.prisma.publications.findUnique({ where: { id } });
  }

  async update(params: Prisma.PublicationsUpdateArgs): Promise<Publications> {
    return await this.prisma.publications.update(params);
  }

  async remove(id: number): Promise<Publications> {
    return await this.prisma.publications.delete({ where: { id } });
  }
}
