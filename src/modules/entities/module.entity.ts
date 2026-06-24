import { Role } from 'src/roles/entities/role.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';

@Entity('modules')
export class ModuleEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Role, role => role.modules, {
    onDelete: 'CASCADE', // Limpieza automática en la tabla intermedia
  })
  @JoinTable() // <--- ¡AÑADE ESTO AQUÍ!
  roles: Role[];
}