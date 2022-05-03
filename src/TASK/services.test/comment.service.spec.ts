import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import CommentService from '../services/comment.service';
import Comments from '../entities/comments.entity';
import Episode from '../entities/episode.entity';
import CommentDto from '../dtos/comment.dto';

describe('CommentsRepository', () => {
  let commentService: CommentService;

  const commentStub: Comments = {
     id: 1,
    comment: "My first comment",
    ipAddressLocation: "105.112.189.117",
    created: new Date(),
    episode: null
}

  const episodeStub: Episode = {
    id: 1,
    name: "oloriebi",
    episodeCode: "oloriebi11",
    releaseDate: new Date(),
    created: new Date(),
    characters: null,
    comments: [],
    commentsCount: 0
};

  const mockEpisodeRepository = {
    save: jest.fn().mockImplementation(_episode => Promise.resolve(episodeStub)),
  }

  const mockCommentRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(_comment => Promise.resolve(commentStub)),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comments),
          useValue: mockCommentRepository,
        },
        {
            provide: getRepositoryToken(Episode),
            useValue: mockEpisodeRepository,
          },
      ],
    }).compile();
    commentService = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(commentService).toBeDefined();
  });

  describe('createComment', () => {
    describe('when creating a comment', () => {
      let comment: Comments;
      let commentDto: CommentDto;

      beforeEach(async () => {
       commentDto =  {
            comment: "My first comment",
        } 
        const ipAddressLocation = "105.112.189.138"
        comment = await commentService.createComment(episodeStub, ipAddressLocation, commentDto.comment);
      });

      test('then it should call Comments Service', () => {
        expect(mockCommentRepository.create).toHaveBeenCalled();
        expect(mockCommentRepository.save).toHaveBeenCalled();
        expect(mockEpisodeRepository.save).toHaveBeenCalled();
      });
      test('then it should return a comment', () => {
        expect(comment).toEqual(commentStub);
      });
    });
  });
});
