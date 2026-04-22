import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../../users/interfaces/user';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        // @InjectRepository(User) private userRepo: Repository<User>
    ) { }

    async validateUser(email: string, password: string) {
        const user: User = await this.usersService.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const { password: _, ...result } = user;
        return result;
    }

    async login(user: UserModel) {
        const payload = {
            sub: user.id,
            email: user.email,
            // roles: user.roles.map(r => r.name),
        };

        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }

    // auth.service.ts
    async checkStatus(user: UserModel) {
        // Aseguramos que buscamos por ID real. 
        // Si la estrategia devuelve el objeto User, el id suele estar en 'user.id'
        const id = user.id;

        const dbUser = await this.usersService.findOne(id);
        if (!dbUser) throw new UnauthorizedException();

        const payload = { sub: dbUser.id, email: dbUser.email };

        return {
            user: dbUser,
            access_token: this.jwtService.sign(payload),
        };
    }
    // async checkStatus(userPayload: any) {
    //     const user = await this.usersService.findOne(userPayload.sub);

    //     if (!user) throw new UnauthorizedException('Usuario no encontrado');

    //     // 2. Generamos un payload limpio
    //     const payload = { sub: user.id, email: user.email };

    //     return {
    //         user: user,
    //         access_token: this.jwtService.sign(payload),
    //     };
    //     // Usamos 'sub' para que la estrategia pueda encontrarlo después
    //     // const payload = {
    //     //     sub: user.sub,
    //     //     email: user.email
    //     // };

    //     // return {
    //     //     user: user,
    //     //     access_token: this.jwtService.sign(payload), // Generamos el token con 'sub'
    //     // };
    // }
}
