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
  });
});
