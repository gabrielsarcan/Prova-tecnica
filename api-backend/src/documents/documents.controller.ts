import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
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
}
