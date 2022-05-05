import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import axios from 'axios';
import { NotFoundException } from '../../commons/custom-exception/notFound.exception';
import { ParseIntPipe } from '../../commons/pipes/parseInt.pipes';
import CommentDto from '../dtos/comment.dto';
import Comments from '../entities/comments.entity';
import CommentService from '../services/comment.service';
import EpisodeService from '../services/episode.service';

@ApiTags('Comments')
@Controller()
export default class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly episodeService: EpisodeService,
  ) {}

  @Post('/episode/:episodeId/comment')
  @ApiCreatedResponse({ description: 'Successfully made a comment'})
  @ApiNotFoundResponse({ description: 'Not found'})
  async createComment(
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Body() body: CommentDto
  ): Promise<Comments> {
      const episode = await this.episodeService.getEpisode( episodeId);
      if(!episode) {
        throw new NotFoundException(`Episode with ID: ${episodeId} not found`);
      }
      const { comment } = body;

      const { data } = await axios.get('https://api.ipify.org/?format=json');
      const ipAddressLocation = data.ip
      
      return await this.commentService.createComment(
        episode,
        ipAddressLocation,
        comment,
      );
  }

  @Get('/episode/:episodeId/comments')
  @ApiOkResponse({ description: 'Comments have been successfully retrieved'})
  @ApiNotFoundResponse({ description: 'Not found'})
  async getComments(
    @Param('episodeId', ParseIntPipe) episodeId: number
  ): Promise<Comments[]> {
      const episode = await this.episodeService.getEpisode( episodeId);
      if (!episode) {
        throw new NotFoundException(`Episode with ID: ${episodeId} not found`);
      }
      return episode.comments;
    }
}