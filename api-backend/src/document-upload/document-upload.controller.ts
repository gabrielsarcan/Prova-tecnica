import {
  Controller,
  Post,
  Get,
  Param,
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

  @Get()
  async listDocuments() {
    return await this.documentUploadService.findAllDocuments();
  }

  @Post(':id/comments')
  async addComment(
    @Param('id') documentId: string,
    @Body('text') text: string,
  ) {
    if (!text || text.trim() === '') {
      throw new BadRequestException('O comentário não pode ser vazio.');
    }
    return await this.documentUploadService.addComment(documentId, text);
  }

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
