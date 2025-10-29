import { Exclude } from 'class-transformer';
import { CreateDateColumn } from 'typeorm';

export class TimestampEntity {
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Exclude()
  @CreateDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
