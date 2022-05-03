import { Body, Controller, Get, InternalServerErrorException, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
      throw new InternalServerErrorException(`Error getting episodes: ${error.message}`);
    }
  }

  @Post('/:characterId/episode')
  @ApiCreatedResponse({ description: 'Successfully created an episode'})
  @ApiNotFoundResponse({ description: 'Not found'})
  async createEpisode(
    @Param('characterId', ParseIntPipe) characterId: number,
    @Body() body: EpisodeDto,
  ): Promise<Episode> {
    try {
      const character = await this.characterService.getCharacter(characterId);
      const releaseDate = new Date();
      const { name, episodeCode } = body;
      return await this.episodeService.createEpisode(
        character,
        name,
        episodeCode,
        releaseDate,
      );
    } catch (error) {
      throw new InternalServerErrorException(`Error creating an episode: ${error.message}`);
    }
  }


  @Get('/:characterId/episode')
  @ApiCreatedResponse({ description: 'Successfully fetched list of episodes by a character'})
  @ApiNotFoundResponse({ description: 'Not found'})
  async getEpisode(
    @Param('characterId', ParseIntPipe) characterId: number,
  ) {
    try {
      const character = await this.characterService.getCharacter(characterId);
      return character.episodes
      
    } catch (error) {
      throw new InternalServerErrorException(`Error creating an episode: ${error.message}`);
    }
  }
}
