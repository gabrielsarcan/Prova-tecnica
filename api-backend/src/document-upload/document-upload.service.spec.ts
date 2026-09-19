import { Test, TestingModule } from '@nestjs/testing';
import { DocumentUploadService } from './document-upload.service';
import { BadRequestException } from '@nestjs/common';

describe('DocumentUploadService', () => {
  let service: DocumentUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentUploadService],
    }).compile();

    service = module.get<DocumentUploadService>(DocumentUploadService);
  });

  describe('Upload de Arquivos - Validação de Formato', () => {
    it('deve rejeitar um arquivo com formato inválido (ex: text/plain)', () => {
      // Mock de um arquivo do Express.Multer.File
      const invalidFile = {
        originalname: 'documento.txt',
        mimetype: 'text/plain',
        buffer: Buffer.from('conteudo falso'),
      } as Express.Multer.File;

      // Assertiva garantindo que a execução vai estourar um erro específico
      expect(() => service.validateFileFormat(invalidFile)).toThrow(
        BadRequestException,
      );
      expect(() => service.validateFileFormat(invalidFile)).toThrow(
        'Formato de arquivo inválido. Apenas PDF, JPG e PNG são permitidos.',
      );
    });
  });
});
