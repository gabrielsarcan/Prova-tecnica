import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Comment } from './comment.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'upload_date' })
  uploadDate: Date;

  @Column({ name: 'file_path' })
  filePath: string;

  @OneToMany(() => Comment, (comment) => comment.document)
  comments: Comment[];
}
