import { Test, TestingModule } from '@nestjs/testing';
import CharacterDto from '../dtos/character.dto';
import Character from '../entities/character.entity';
import { Gender, Status } from '../enum/index.enum';
import CharacterService from '../services/character.service';
import LocationService from '../services/location.service';
import CharacterController from '../controllers/character.controller';

describe('CharacterController', () => {
  let characterController: CharacterController;
  let characterService: CharacterService;

  const characterStub = {
    id: 1,
    firstName: 'Seunayo',
    lastName: 'Eyiyemi',
    status: 'active',
    gender: 'male',
    created: '2022-04-30T12:44:59.350Z',
    location: {
      id: 1,
      name: 'Lagos',
      longitude: 2.878926,
      created: '2022-04-30T12:44:59.293Z',
      latitude: 6.822807,
    },
  };

  const locationStub = {
    id: 1,
    name: 'Lagos',
    longitude: 2.878926,
    created: '2022-04-30T12:44:59.293Z',
    latitude: 6.822807,
  };

  const mockCharacterService = {
    getCharacter: jest.fn().mockResolvedValue(characterStub),
    getCharacters: jest.fn().mockResolvedValue([characterStub]),
    createCharacter: jest.fn().mockResolvedValue(characterStub),
  };
  const mockLocationService = {
    getLocation: jest.fn().mockResolvedValue(locationStub),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharacterController],
      providers: [
        CharacterService,
        {
          provide: LocationService,
          useValue: mockLocationService,
        },
      ],
    })
      .overrideProvider(CharacterService)
      .useValue(mockCharacterService)
      .compile();

    characterController = module.get<CharacterController>(CharacterController);
    characterService = module.get<CharacterService>(CharacterService);
  });

  it('should be defined', () => {
    expect(characterController).toBeDefined();
  });

  describe('getCharacter', () => {
    describe('when getting a character', () => {
      let character: Character;

      beforeEach(async () => {
        character = await characterController.getCharacter(characterStub.id);
      });

      test('then it should call Character Service', () => {
        expect(characterService.getCharacter).toHaveBeenCalled();
      });
      test('then it should return a character', () => {
        expect(character).toEqual(characterStub);
      });
    });
  });

  describe('getCharacters', () => {
    describe('when getting characters', () => {
      let characters: Character[];

      beforeEach(async () => {
        characters = await characterController.getCharacters({});
      });

      test('then it should call Character Service', () => {
        expect(characterService.getCharacters).toHaveBeenCalled();
      });
      test('then it should return characters', () => {
        expect(characters).toEqual([characterStub]);
      });
    });
  });

  describe('createCharacter', () => {
    describe('when creating a character', () => {
      let character: Character;
      let characterDto: CharacterDto;

      beforeEach(async () => {
        characterDto = {
          firstName: 'Seunayo',
          lastName: 'Eyiyemi',
          status: Status.ACTIVE,
          gender: Gender.MALE,
        };

        character = await characterController.createCharacter(1, characterDto);
      });

      test('then it should call Character Service', () => {
        expect(characterService.createCharacter).toHaveBeenCalled();
      });
      test('then it should return a character', () => {
        expect(character).toEqual(characterStub);
      });
    });
  });
});
