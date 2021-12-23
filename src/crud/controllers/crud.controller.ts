import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { CrudService } from '../providers/crud.service';
import { CreateCrudDto } from '../dto/create-crud.dto';
import { UpdateCrudDto } from '../dto/update-crud.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Publications, User } from '@prisma/client';

@Controller('post')
export class CrudController {
  constructor(private readonly crudService: CrudService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req: any, @Body() data: CreateCrudDto) {
    const result = (await this.crudService.create({
      data: {
        ...data,
        user: { connect: { id: req.user.id } },
      },
      include: { user: true },
    })) as Publications & { user: User[] };

    return {
      status: 201,
      message: 'Post criado com sucesso!',
      result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('title') title: string,
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ) {
    if (!page) page = 1;
    if (!perPage) perPage = 10;

    const result = await this.crudService.findMany({
      where: {
        ...(title && { title: { contains: title, mode: 'insensitive' } }),
      },
      skip: (+page - 1) * +perPage,
      take: +perPage,
    });

    return {
      status: 200,
      message: 'Posts encontrados!',
      page,
      perPage,
      result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('myPosts')
  async findAllMine(
    @Request() req: any,
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ) {
    if (!page) page = 1;
    if (!perPage) perPage = 10;

    const result = await this.crudService.findMany({
      where: {
        userId: req.user.id,
      },
      skip: (+page - 1) * +perPage,
      take: +perPage,
    });

    if (result.length === 0)
      throw new NotFoundException('Você ainda não possui posts');

    return {
      status: 200,
      message: 'Posts encontrados!',
      page,
      perPage,
      result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const result = await this.crudService.findUnique(id);

    if (!result) throw new NotFoundException('Post não encontrado');

    return {
      status: 200,
      message: 'Post encontrado!',
      result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Request() req: any,
    @Param('id') id: number,
    @Body() data: UpdateCrudDto,
  ) {
    const postExists = await this.crudService.findUnique(+id);

    if (!postExists) throw new NotFoundException('Post não existe');
    if (postExists.userId !== req.user.id)
      throw new UnauthorizedException('Post não pertence ao usuário');

    const result = await this.crudService.update({
      where: { id: +id },
      data,
    });

    return {
      status: 204,
      message: 'Post alterado com sucesso!',
      result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req: any) {
    const postExists = await this.crudService.findUnique(+id);

    if (!postExists) throw new NotFoundException('Post não existe');
    if (postExists.userId !== req.user.id)
      throw new UnauthorizedException('Post não pertence ao usuário');

    await this.crudService.remove(+id);

    return {
      status: 200,
      message: 'Post deletado com sucesso',
      postExists,
    };
  }
}
