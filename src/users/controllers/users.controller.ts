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
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../providers/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() data: CreateUserDto) {
    const emailExists = await this.usersService.findMany({
      where: {
        ...(data.email && {
          email: { contains: data.email, mode: 'insensitive' },
        }),
      },
    });

    if (emailExists.length > 0)
      throw new BadRequestException('Email já cadastrado');

    const result = await this.usersService.create({ data });

    return {
      status: 201,
      message: 'Usuário criado com sucesso!',
      result,
    };
  }

  @Get()
  async findAll(
    @Query('title') name: string,
    @Query('email') email: string,
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ) {
    if (!page) page = 1;
    if (!perPage) perPage = 10;

    const result = await this.usersService.findMany({
      where: {
        ...(name && { name: { contains: name, mode: 'insensitive' } }),
        ...(email && { email: { contains: email, mode: 'insensitive' } }),
      },
      skip: (+page - 1) * +perPage,
      take: +perPage,
    });

    return {
      status: 200,
      message: 'Usuários encontrados!',
      page,
      perPage,
      result,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const result = await this.usersService.findUnique(id);

    if (!result) throw new NotFoundException('Usuário não encontrado');

    return {
      status: 200,
      message: 'Usuário encontrado!',
      result,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() data: UpdateUserDto) {
    const userExists = await this.usersService.findUnique(+id);

    if (!userExists) throw new NotFoundException('Usuário não existee');
    const result = await this.usersService.update({
      where: { id: +id },
      data,
    });

    return {
      status: 204,
      message: 'Usuário alterado com sucesso!',
      result,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const userExists = await this.usersService.findUnique(+id);

    if (!userExists) throw new NotFoundException('Usuário não existe');
    await this.usersService.remove(+id);

    return {
      status: 200,
      message: 'Usuário deletado com sucesso',
      userExists,
    };
  }
}
