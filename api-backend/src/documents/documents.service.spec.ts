import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';

describe('DocumentsService', () => {
  let service: DocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest
              .fn()
              .mockImplementation((doc) =>
                Promise.resolve({ id: '1', ...doc }),
              ),
          },
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateFileFormat', () => {
    it('should throw if invalid format', () => {
      const file = { mimetype: 'text/plain' } as Express.Multer.File;
      expect(() => service.validateFileFormat(file)).toThrow();
    });

    it('should return true if valid format', () => {
      const file = { mimetype: 'application/pdf' } as Express.Multer.File;
      expect(service.validateFileFormat(file)).toBe(true);
    });
  });
});
