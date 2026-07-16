import { Body, Controller, Patch, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/auth.guard';
import { GetUser } from '../../../auth/decorators/get-user.decorator';
import { ChangePasswordDto } from 'src/users/dtos/user.dto';
import { UsersService } from '../../services/users/users.service';

@ApiTags('profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {

    constructor(private readonly usersService: UsersService) { }

    @Patch('change-password')
    async changePassword(
        @GetUser('id') userId: number,
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        return await this.usersService.changePassword(userId, changePasswordDto);
    }

    // En tu profile.controller.ts del Backend

    @Put() // No requiere ruta extra, mapea directamente a PUT /profile
    async updateProfile(
        @GetUser('id') userId: number,
        @Body() updateUserDto: any // Aquí usas tu DTO de actualización de usuario
    ) {
        // Reutilizamos el método update del usersService que ya recibe el ID y los datos
        return await this.usersService.updateUser(userId, updateUserDto);
    }
}