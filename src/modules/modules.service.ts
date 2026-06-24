import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuleEntity } from './entities/module.entity';
import { In, Repository } from 'typeorm';
import { CreateModuleDto, UpdateModuleDto } from './dtos/create-module.dto';

@Injectable()
export class ModulesService {

    constructor(
        @InjectRepository(ModuleEntity)
        private moduleRepository: Repository<ModuleEntity>,
    ) { }

    async findByIds(ids: number[]) {
        return this.moduleRepository.findBy({ id: In(ids) });
    }

    create(dto: CreateModuleDto) {
        const module = this.moduleRepository.create(dto);
        return this.moduleRepository.save(module);
    }

    findAll() {
        return this.moduleRepository.find();
    }

    async findOne(id: number) {
        const role = await this.moduleRepository.findOne({ where: { id } });
        if (!role) {
            throw new NotFoundException(`Role #${id} not found`);
        }
        return role;
    }

    async update(id: number, updateModuleDto: UpdateModuleDto) {
        // 1️⃣ Buscamos el role existente
        const module = await this.findOne(id);
        if (!module) throw new NotFoundException('Role not found');

        // 2️⃣ Validamos que el nuevo nombre no exista en otro rol
        if (updateModuleDto.name) {
            const existingRole = await this.moduleRepository.findOne({
                where: { name: updateModuleDto.name },
            });

            if (existingRole && existingRole.id !== id) {
                throw new BadRequestException('Role name already exists');
            }
        }

        // 3️⃣ Si vienen nuevos módulos, los actualizamos
        // if (updateRoleDto.moduleIds) {
        //     const modules = await this.modulesService.findByIds(updateRoleDto.moduleIds);
        //     if (modules.length !== updateRoleDto.moduleIds.length) {
        //         throw new NotFoundException('Some modules were not found');
        //     }
        //     role.modules = modules;
        // }

        // 4️⃣ Mergeamos el resto de los campos
        this.moduleRepository.merge(module, updateModuleDto);

        // 5️⃣ Guardamos
        return this.moduleRepository.save(module);
    }

    // async remove(id: number) {
    //     // 1. Buscamos el module incluyendo la relación
    //     const module = await this.moduleRepository.findOne({
    //         where: { id }
    //     });

    //     if (!module) {
    //         throw new NotFoundException(`Role #${id} not found`);
    //     }

    //     // // 2. Validamos si el array tiene registros
    //     // if (role.users && role.users.length > 0) {
    //     //     throw new BadRequestException(
    //     //         `No se puede eliminar el rol: hay ${role.users.length} usuario(s) asignados a él.`
    //     //     );
    //     // }

    //     // 3. Si está limpio, procedemos a borrar
    //     return await this.moduleRepository.remove(module);
    // }

    async remove(id: number) {
        // const module = await this.findOne(id); // Reutiliza tu findOne que ya lanza la excepción

        const module = await this.moduleRepository.findOne({
            where: { id }
        });

        if (!module) {
            throw new NotFoundException(`Role #${id} not found`);
        }
        // Al usar delete, se envía un comando directo a SQL
        // Gracias al onDelete: 'CASCADE' en la entidad, la DB limpiará la relación con los roles
        await this.moduleRepository.delete(id);

        return { deleted: true, id };
    }



}