import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentUploadModule } from './document-upload/document-upload.module';
import { Document } from './document-upload/entities/document.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'document_db',
      entities: [Document],
      synchronize: true, // Apenas para desenvolvimento (cria tabelas automaticamente)
    }),
    DocumentUploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
