import { Test, TestingModule } from '@nestjs/testing';
import 'multer';
import { DocumentUploadService } from './document-upload.service';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';

describe('DocumentUploadService', () => {
  let service: DocumentUploadService;

  beforeEach(async () => {
    // Criamos um Mock simples do repositório para o teste
    const mockDocumentRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentUploadService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockDocumentRepository,
        },
      ],
    }).compile();

    service = module.get<DocumentUploadService>(DocumentUploadService);
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
});
