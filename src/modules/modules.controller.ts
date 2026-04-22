import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, Delete, HttpCode } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto, UpdateModuleDto } from './dtos/create-module.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Modules')
@Controller('modules')
export class ModulesController {

  constructor(private readonly modulesService: ModulesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new module' })
  create(@Body() dto: CreateModuleDto) {
    return this.modulesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all modules' })
  findAll() {
    return this.modulesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get module by id' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.modulesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a module by id' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    return this.modulesService.update(id, updateModuleDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a module by id' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.modulesService.remove(id);
  }

}