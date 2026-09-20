import { Test, TestingModule } from '@nestjs/testing';
import 'multer';
import { DocumentUploadService } from './document-upload.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { Comment } from './entities/comment.entity';

describe('DocumentUploadService', () => {
  let service: DocumentUploadService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    // Criamos um Mock simples do repositório para o teste
    const mockDocumentRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };

    const mockCommentRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    moduleRef = await Test.createTestingModule({
      providers: [
        DocumentUploadService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockDocumentRepository,
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<DocumentUploadService>(DocumentUploadService);
  });

  describe('Upload de Arquivos - Validação de Formato', () => {
    it('deve rejeitar um arquivo com formato inválido (ex: text/plain)', () => {
      const invalidFile = {
        originalname: 'documento.txt',
        mimetype: 'text/plain',
        buffer: Buffer.from('conteudo falso'),
      } as Express.Multer.File;

      expect(() => service.validateFileFormat(invalidFile)).toThrow(
        BadRequestException,
      );
      expect(() => service.validateFileFormat(invalidFile)).toThrow(
        'Formato de arquivo inválido. Apenas PDF, JPG e PNG são permitidos.',
      );
    });
  });

  describe('Inserção de Comentários (TDD)', () => {
    it('deve retornar erro 404 (NotFoundException) se o documento não existir', async () => {
      const docRepo = moduleRef.get(getRepositoryToken(Document));

      jest.spyOn(docRepo, 'findOne').mockResolvedValue(null);

      await expect(
        service.addComment('id-falso', 'Comentário teste'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
