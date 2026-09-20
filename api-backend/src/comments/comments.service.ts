import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Document } from '../documents/entities/document.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async addComment(documentId: string, text: string): Promise<Comment> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Documento não encontrado.');
    }

    const comment = this.commentRepository.create({
      text,
      document,
    });

    return await this.commentRepository.save(comment);
  }

  async getComments(documentId: string): Promise<Comment[]> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException('Documento não encontrado.');
    }

    return await this.commentRepository.find({
      where: { document: { id: documentId } },
      order: { createdAt: 'DESC' },
    });
  }
}
