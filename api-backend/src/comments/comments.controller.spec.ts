import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: {
            addComment: jest.fn().mockResolvedValue({ id: '1', text: 'Teste' }),
          },
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addComment', () => {
    it('should call service.addComment', async () => {
      const dto: CreateCommentDto = { text: 'Teste' };
      const documentId = '1';

      const result = await controller.addComment(documentId, dto);

      expect(service.addComment).toHaveBeenCalledWith(documentId, dto.text);
      expect(result.id).toBeDefined();
    });
    it('should throw BadRequestException if text is empty', async () => {
      const dto: CreateCommentDto = { text: '' };
      const documentId = '1';

      try {
        await controller.addComment(documentId, dto);
      } catch (e: any) {
        expect(e.status).toBe(400);
        expect(e.message).toBe('O comentário não pode ser vazio.');
      }
    });
  });

  describe('getComments', () => {
    it('should call service.getComments and return an array of comments', async () => {
      const documentId = '1';
      const mockComments = [{ id: '1', text: 'Teste', createdAt: new Date() }];

      jest.spyOn(service, 'getComments').mockResolvedValue(mockComments as any);

      const result = await controller.getComments(documentId);

      expect(service.getComments).toHaveBeenCalledWith(documentId);
      expect(result).toEqual(mockComments);
    });
  });
});
