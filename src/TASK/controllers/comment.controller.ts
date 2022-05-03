import { Body, Controller, Get, InternalServerErrorException, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import axios from 'axios';
import { ParseIntPipe } from '../../commons/pipes/parseInt.pipes';
import CommentDto from '../dtos/comment.dto';
import Comments from '../entities/comments.entity';
import Episode from '../entities/episode.entity';
import CharacterService from '../services/character.service';
import CommentService from '../services/comment.service';
import EpisodeService from '../services/episode.service';

@ApiTags('Comments')
@Controller()
export default class CommentController {
  constructor(
    private readonly characterService: CharacterService,
    private readonly commentService: CommentService,
    private readonly episodeService: EpisodeService,
  ) {}

  @Post('/:characterId/episode/:episodeId/comment')
  @ApiCreatedResponse({ description: 'Successfully made a comment'})
  @ApiNotFoundResponse({ description: 'Not found'})
  async createComment(
    @Param('characterId', ParseIntPipe) characterId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Body() body: CommentDto
  ): Promise<Comments>{
    try {
      await this.characterService.getCharacter(characterId);
    const episode = await this.episodeService.getEpisode( episodeId);
    const { comment } = body;

    const { data } = await axios.get('https://api.ipify.org/?format=json');
    const ipAddressLocation = data.ip
    
    return await this.commentService.createComment(
      episode,
      ipAddressLocation,
      comment,
    );
    } catch (error) {
      throw new InternalServerErrorException(`Error making a comment: ${error.message}`);
    }
  }

  @Get('/:characterId/episode/:episodeId/comments')
  @ApiOkResponse({ description: 'Comments have been successfully retrieved'})
  @ApiNotFoundResponse({ description: 'Not found'})
  async getComments(
    @Param('characterId', ParseIntPipe) characterId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number
  ): Promise<Episode> {
    try {
      await this.characterService.getCharacter(characterId);
      return await this.episodeService.getEpisode( episodeId);  
    } catch (error) {
      throw new InternalServerErrorException(`Error getting comments: ${error.message}`);
    }
  }
}
