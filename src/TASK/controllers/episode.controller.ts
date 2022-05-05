import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { NotFoundException } from '../../commons/custom-exception/notFound.exception';
import { RepositoryException } from '../../commons/custom-exception/repository.exception';
import { ParseIntPipe } from '../../commons/pipes/parseInt.pipes';
import EpisodeDto from '../dtos/episode.dto';
import Episode from '../entities/episode.entity';
import CharacterService from '../services/character.service';
import EpisodeService from '../services/episode.service';


@ApiTags('Episode')
@Controller()
export default class EpisodeController {
  constructor(
    private readonly characterService: CharacterService,
    private readonly episodeService: EpisodeService,
  ) {}

  @Get('/episodes')
  @ApiOkResponse({ description: 'Episodes have been successfully retrieved'})
  @ApiNotFoundResponse({ description: 'Not found'})
  async getEpisodes(): Promise<Episode[]> {
    try {
      return await this.episodeService.getEpisodes();
    } catch (error) {
      throw new RepositoryException(`Error fetching episodes: ${error.message}`);
    }
  }

  @Post('/:characterId/episode')
  @ApiCreatedResponse({ description: 'Successfully created an episode'})
  @ApiNotFoundResponse({ description: 'Not found'})
  async createEpisode(
    @Param('characterId', ParseIntPipe) characterId: number,
    @Body() body: EpisodeDto,
  ): Promise<Episode> {
      const character = await this.characterService.getCharacter(characterId);
      if(!character) {
        throw new NotFoundException(`Character with ID: ${characterId} not found`);
      }
      const releaseDate = new Date();
      const { name, episodeCode } = body;
      return await this.episodeService.createEpisode(
        character,
        name,
        episodeCode,
        releaseDate,
      );
  }


  @Get('/:characterId/episode')
  @ApiCreatedResponse({ description: 'Successfully fetched list of episodes by a character'})
  @ApiNotFoundResponse({ description: 'Not found'})
  async getEpisode(
    @Param('characterId', ParseIntPipe) characterId: number,
  ) {
      const character = await this.characterService.getCharacter(characterId);
      if(!character) {
        throw new NotFoundException(`Character with ID: ${characterId} not found`);
      }
      return character.episodes
      
    }
}
