import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
@ApiTags('comments')
@Controller('documents/:documentId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar um comentário a um documento' })
  @ApiParam({
    name: 'documentId',
    description: 'ID do documento',
    type: 'string',
  })
  @ApiResponse({
    status: 201,
    description: 'Comentário adicionado com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 404, description: 'Documento não encontrado.' })
  async addComment(
    @Param('documentId') documentId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    if (!createCommentDto.text || createCommentDto.text.trim() === '') {
      throw new BadRequestException('O comentário não pode ser vazio.');
    }
    return await this.commentsService.addComment(
      documentId,
      createCommentDto.text,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os comentários de um documento' })
  @ApiParam({
    name: 'documentId',
    description: 'ID do documento',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de comentários retornada com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Documento não encontrado.' })
  async getComments(@Param('documentId') documentId: string) {
    return await this.commentsService.getComments(documentId);
  }
}
