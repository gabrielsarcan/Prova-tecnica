import { Module } from '@nestjs/common';
import { DocumentUploadService } from './document-upload.service';

@Module({
  providers: [DocumentUploadService],
})
export class DocumentUploadModule {}
