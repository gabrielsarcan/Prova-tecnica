import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentUploadService } from './document-upload.service';
import { DocumentUploadController } from './document-upload.controller';
import { Document } from './entities/document.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Comment])],
  controllers: [DocumentUploadController],
  providers: [DocumentUploadService],
})
export class DocumentUploadModule {}
