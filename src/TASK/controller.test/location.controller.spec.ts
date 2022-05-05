import { Test, TestingModule } from '@nestjs/testing';
import LocationDto from '../dtos/Location.dto';
import Location from '../entities/location.entity';
import CharacterService from '../services/character.service';
import LocationService from '../services/location.service';
import LocationController from '../controllers/location.controller';

describe('LocationController', () => {
  let controller: LocationController;
  let locationService: LocationService;

  const locationStub = {
    id: 1,
    name: 'Lagos',
    longitude: 2.878926,
    created: new Date(),
    latitude: 6.822807,
  };

  const mockLocationService = {
    getLocations: jest.fn().mockResolvedValue([locationStub]),
    createLocation: jest.fn().mockResolvedValue(locationStub),
  };
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        LocationService
      ],
    })
      .overrideProvider(LocationService)
      .useValue(mockLocationService)
      .compile();

    controller = module.get<LocationController>(LocationController);
    locationService = module.get<LocationService>(LocationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLocations', () => {
    describe('when getting locations', () => {
      let locations: Location[];

      beforeEach(async () => {
        locations = await controller.getLocations();
      });

      test('then it should call location Service', () => {
        expect(locationService.getLocations).toHaveBeenCalled();
      });
      test('then it should return Locations', () => {
        expect(locations).toEqual([locationStub]);
      });
    });
  });

  describe('createLocation', () => {
    describe('when creating a location', () => {
      let location: Location;
      let locationDto: LocationDto;

      beforeEach(async () => {
        locationDto = {
            name: 'Lagos',
            longitude: 2.878926,
            latitude: 6.822807,
          };

        location = await controller.createLocation(locationDto);
      });

      test('then it should call Location Service', () => {
        expect(locationService.createLocation).toHaveBeenCalled();
      });
      test('then it should return a Location', () => {
        expect(location).toEqual(locationStub);
      });
    });
  });
});
