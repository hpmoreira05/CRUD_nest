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
} from '@nestjs/common';
import { CrudService } from '../providers/crud.service';
import { CreateCrudDto } from '../dto/create-crud.dto';
import { UpdateCrudDto } from '../dto/update-crud.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('post')
export class CrudController {
  constructor(private readonly crudService: CrudService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() data: CreateCrudDto) {
    const result = await this.crudService.create({ data });

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
  async update(@Param('id') id: number, @Body() data: UpdateCrudDto) {
    const postExists = await this.crudService.findUnique(+id);

    if (!postExists) throw new NotFoundException('Post não existee');
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
  async remove(@Param('id') id: number) {
    const postExists = await this.crudService.findUnique(+id);

    if (!postExists) throw new NotFoundException('Post não existe');
    await this.crudService.remove(+id);

    return {
      status: 200,
      message: 'Post deletado com sucesso',
      postExists,
    };
  }
}
