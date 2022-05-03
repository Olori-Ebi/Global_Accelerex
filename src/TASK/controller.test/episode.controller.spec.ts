import { Test, TestingModule } from '@nestjs/testing';
import EpisodeDto from '../dtos/episode.dto';
import Episode from '../entities/episode.entity';
import CharacterService from '../services/character.service';
import EpisodeService from '../services/episode.service';
import EpisodeController from '../controllers/episode.controller';
import { Gender, Status } from '../enum/index.enum';

describe('EpisodeController', () => {
  let controller: EpisodeController;
  let episodeService: EpisodeService;

  const episodeStub = {
    id: 1,
    name: "oloriebi",
    episodeCode: "oloriebi11",
    releaseDate: new Date(),
    created: new Date(),
    comments: [],
    commentsCount: 0
};

const characterStub = {
    id: 1,
    firstName: 'Seunayo',
    lastName: 'Eyiyemi',
    status: Status.ACTIVE,
    gender: Gender.MALE,
    created: new Date(),
    location: {
      id: 1,
      name: 'Lagos',
      longitude: 2.878926,
      created: new Date(),
      latitude: 6.822807,
    },
  };

  const mockEpisodeService = {
    getEpisodes: jest.fn().mockResolvedValue([episodeStub]),
    createEpisode: jest.fn().mockResolvedValue(episodeStub),
  };
  const mockCharacterservice = {
    getCharacter: jest.fn().mockResolvedValue(characterStub),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpisodeController],
      providers: [
        EpisodeService,
        {
          provide: CharacterService,
          useValue: mockCharacterservice,
        },
      ],
    })
      .overrideProvider(EpisodeService)
      .useValue(mockEpisodeService)
      .compile();

    controller = module.get<EpisodeController>(EpisodeController);
    episodeService = module.get<EpisodeService>(EpisodeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getEpisodes', () => {
    describe('when getting episodes', () => {
      let episodes: Episode[];

      beforeEach(async () => {
        episodes = await controller.getEpisodes();
      });

      test('then it should call episode Service', () => {
        expect(episodeService.getEpisodes).toHaveBeenCalled();
      });
      test('then it should return episodes', () => {
        expect(episodes).toEqual([episodeStub]);
      });
    });
  });

  describe('createEpisode', () => {
    describe('when creating an episode', () => {
      let episode: Episode;
      let episodeDto: EpisodeDto;

      beforeEach(async () => {
        episodeDto = {
            name: "oloriebi",
            episodeCode: "oloriebi11",
            releaseDate: new Date(),
        };

        episode = await controller.createEpisode(1, episodeDto);
      });

      test('then it should call episode Service', () => {
        expect(episodeService.createEpisode).toHaveBeenCalled();
      });
      test('then it should return a episode', () => {
        expect(episode).toEqual(episodeStub);
      });
    });
  });
});
