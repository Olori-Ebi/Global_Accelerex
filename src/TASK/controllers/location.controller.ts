import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RepositoryException } from '../../commons/custom-exception/repository.exception';
import LocationDto from '../dtos/location.dto';
import Location from '../entities/location.entity';
import LocationService from '../services/location.service';

@ApiTags('Location')
@Controller()
export default class LocationController {
  constructor(
    private readonly locationService: LocationService,
  ) {}

  @Post('/location')
  @ApiCreatedResponse({ description: 'Successfully created a location' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async createLocation(@Body() body: LocationDto): Promise<Location> {
    try {
      const { name, longitude, latitude } = body;
      return await this.locationService.createLocation(name, longitude, latitude);
    } catch (error) {
      throw new RepositoryException(`Error creating a location: ${error.message}`);
    }
  }

  @Get('/location')
  @ApiOkResponse({ description: 'Locations have been successfully retrieved' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async getLocations(): Promise<Location[]> {
    try {
      return await this.locationService.getLocations();
    } catch (error) {
      throw new RepositoryException(`Error fetching locations: ${error.message}`);
    }
  }
}
