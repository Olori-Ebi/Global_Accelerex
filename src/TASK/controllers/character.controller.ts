import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { NotFoundException } from '../../commons/custom-exception/notFound.exception';
import { RepositoryException } from '../../commons/custom-exception/repository.exception';
import { ParseIntPipe } from '../../commons/pipes/parseInt.pipes';
import CharacterDto from '../dtos/character.dto';
import { FilterDto } from '../dtos/filter.dto';
import Character from '../entities/character.entity';
import CharacterService from '../services/character.service';
import LocationService from '../services/location.service';

@ApiTags('Character')
@Controller()
export default class CharacterController {
  constructor(
    private readonly characterService: CharacterService,
    private readonly locationService: LocationService,
  ) {}

  @Get('/hello')
  @ApiOkResponse({ description: 'Returned Hello ! successfully'})
  @ApiNotFoundResponse({ description: 'Not found'})
  async getHello(): Promise<string> {
    const helloResponse = await this.characterService.getHello();
    return helloResponse;
  }
 
  @Get('/characters')
  @ApiOkResponse({ description: 'Resource has been successfully retrieved'})
  @ApiNotFoundResponse({ description: 'Not found'})
  async getCharacters(@Query() filterDto: FilterDto): Promise<Character[]> {
    try {
      return await this.characterService.getCharacters(filterDto)
    } catch (error) {
      throw new RepositoryException(`Error fetching characters: ${error.message}`);
    }
  }

  @Post('/:locationId/character')
  @ApiCreatedResponse({ description: 'Resource list has been successfully created'})
  @ApiNotFoundResponse({ description: 'Not found'})
  async createCharacter(
    @Param('locationId', ParseIntPipe) locationId: number,
    @Body() body: CharacterDto,
  ): Promise<Character> {
    try {
      const location = await this.locationService.getLocation(locationId);
      if(!location) {
        throw new NotFoundException(`Location with ID "${locationId}" not found`);
      }
      return await this.characterService.createCharacter(
        body,
        location,
      );
    } catch (error) {
      if(error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('A character can only be at a location')
      } else {
        throw new RepositoryException(`Error creating a character: ${error.message}`);
      }
    }
  }

  @ApiOkResponse({ description: 'Resource has been successfully retrieved'})
  @ApiNotFoundResponse({ description: 'Not found'})
  @Get('/:characterId/character')
  async getCharacter(@Param('characterId', ParseIntPipe) characterId: number): Promise<Character> {
      const character = await this.characterService.getCharacter(characterId);
      if (!character) {
        throw new NotFoundException(`Character with ID "${characterId}" not found`);
      } else {
        return character;
      }
  }
}
