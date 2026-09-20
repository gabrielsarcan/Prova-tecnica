import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Document } from '../documents/entities/document.entity';
import { NotFoundException } from '@nestjs/common';

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: {
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest
              .fn()
              .mockImplementation((comment) =>
                Promise.resolve({ id: '1', ...comment }),
              ),
          },
        },
        {
          provide: getRepositoryToken(Document),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: '1', title: 'Doc' }),
          },
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addComment', () => {
    it('should add a comment to an existing document', async () => {
      const result = await service.addComment('1', 'Comentário de teste');
      expect(result.text).toBe('Comentário de teste');
      expect(result.id).toBeDefined();
    });

    it('should throw if document does not exist', async () => {
      jest
        .spyOn(service['documentRepository'], 'findOne')
        .mockResolvedValueOnce(null);
      await expect(
        service.addComment('1', 'Comentário de teste'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getComments', () => {
    it('should return comments for a given document', async () => {
      const mockComments = [{ id: '1', text: 'Teste', createdAt: new Date() }];

      jest
        .spyOn(service['documentRepository'], 'findOne')
        .mockResolvedValueOnce({ id: '1', title: 'Doc' } as any);
      jest
        .spyOn(service['commentRepository'], 'find')
        .mockResolvedValueOnce(mockComments as any);

      const result = await service.getComments('1');
      expect(result).toEqual(mockComments);
    });

    it('should throw if document does not exist when getting comments', async () => {
      jest
        .spyOn(service['documentRepository'], 'findOne')
        .mockResolvedValueOnce(null);
      await expect(service.getComments('1')).rejects.toThrow(NotFoundException);
    });
  });
});
