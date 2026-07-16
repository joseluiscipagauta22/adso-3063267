import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolesModule } from 'src/roles/roles.module';
// import { RolesModule } from 'src/roles/roles.module';
import { ProfileController } from './controllers/profile/profile.controller';

@Module({
  imports:[
    TypeOrmModule.forFeature([User]),
    RolesModule
  ],
  controllers: [UsersController, ProfileController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
