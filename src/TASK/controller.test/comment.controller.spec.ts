import { Test, TestingModule } from '@nestjs/testing';
import EpisodeService from '../services/episode.service';
import CommentController from '../controllers/comment.controller';
import CommentService from '../services/comment.service';
import Comments from '../entities/comments.entity';
import CommentDto from '../dtos/comment.dto';

describe('CommentController', () => {
  let commentController: CommentController;
  let commentService: CommentService;

  const commentStub = {
    id: 1,
    comment: 'My first comment',
    ipAddressLocation: '105.112.189.117',
    created: new Date(),
  };

  const episodeStub = {
    id: 1,
    name: 'oloriebi',
    episodeCode: 'oloriebi11',
    releaseDate: new Date(),
    created: new Date(),
    comments: [],
    commentsCount: 0,
  };

  const mockCommentService = {
    getComments: jest.fn().mockResolvedValue([]),
    createComment: jest.fn().mockResolvedValue(commentStub),
  };

  const mockEpisodeService = {
    getEpisodes: jest.fn().mockResolvedValue([episodeStub]),
    getEpisode: jest.fn().mockResolvedValue(episodeStub),
    createEpisode: jest.fn().mockResolvedValue(episodeStub),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        CommentService,
        {
          provide: EpisodeService,
          useValue: mockEpisodeService,
        },
      ],
    })
      .overrideProvider(CommentService)
      .useValue(mockCommentService)
      .compile();

    commentController = module.get<CommentController>(CommentController);
    commentService = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(commentController).toBeDefined();
  });

  describe('getComments', () => {
    describe('when getting comments', () => {
      let comments;

      beforeEach(async () => {
        comments = await commentController.getComments(1);
      });
      test('then it should return comments on an episode', () => {
        expect(comments.length).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('createComment', () => {
    describe('when creating a comment', () => {
      let comment: Comments;
      let commentDto: CommentDto;

      beforeEach(async () => {
        commentDto = {
          comment: 'My first comment',
        };
        comment = await commentController.createComment(1, commentDto);
      });

      test('then it should call Comment Service', () => {
        expect(commentService.createComment).toHaveBeenCalled();
      });
      test('then it should return a comment', () => {
        expect(comment).toEqual(commentStub);
      });
    });
  });
});
