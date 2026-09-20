import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  Param,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';

@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os documentos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de documentos retornada com sucesso.',
  })
  async listDocuments() {
    return await this.documentsService.findAllDocuments();
  }

  @Post('upload')
  @ApiOperation({ summary: 'Fazer upload de um novo documento' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Documento enviado com sucesso.' })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou arquivo não enviado.',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado.');
    }
    if (!createDocumentDto.title) {
      throw new BadRequestException('O título do documento é obrigatório.');
    }

    return await this.documentsService.uploadDocument(
      file,
      createDocumentDto.title,
      createDocumentDto.description,
    );
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Fazer download de um documento' })
  @ApiResponse({
    status: 200,
    description: 'Download iniciado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Documento ou ficheiro não encontrado.',
  })
  async downloadDocument(@Param('id') id: string, @Res() res: Response) {
    const absolutePath = await this.documentsService.getDocumentFilePath(id);
    res.download(absolutePath);
  }
}
