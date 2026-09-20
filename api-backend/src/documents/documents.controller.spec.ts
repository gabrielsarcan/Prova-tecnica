import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let service: DocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsService,
          useValue: {
            findAllDocuments: jest.fn().mockResolvedValue([]),
            uploadDocument: jest
              .fn()
              .mockResolvedValue({ id: '1', title: 'Teste' }),
          },
        },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should call service.uploadDocument', async () => {
      const dto: CreateDocumentDto = {
        title: 'Teste',
        description: 'Desc',
        file: {},
      };
      const file = {} as Express.Multer.File;

      const result = await controller.uploadFile(file, dto);

      expect(service.uploadDocument).toHaveBeenCalledWith(
        file,
        dto.title,
        dto.description,
      );
      expect(result.id).toBeDefined();
    });
  });
});
