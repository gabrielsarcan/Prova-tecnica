import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentUploadService } from './document-upload.service';

@Controller('documents')
export class DocumentUploadController {
  constructor(private readonly documentUploadService: DocumentUploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // Memória por padrão (buffer)
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('description') description?: string,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado.');
    }
    if (!title) {
      throw new BadRequestException('O título do documento é obrigatório.');
    }

    return await this.documentUploadService.uploadDocument(
      file,
      title,
      description,
    );
  }
}
