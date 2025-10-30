import { Exclude } from 'class-transformer';
import { TimestampEntity } from '@common/entities/timestamp.entity';
import { Post } from '@posts/entities/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @OneToMany(() => Post, (p) => p.author)
  posts: Post[];
}
