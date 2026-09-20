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
      url: process.env.DATABASE_URL,
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      username: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'document_db',
      entities: [Document],
      synchronize: true, // Apenas para desenvolvimento (cria tabelas automaticamente)
    }),
    DocumentUploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
