import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentUploadModule } from './document-upload/document-upload.module';

@Module({
  imports: [DocumentUploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
