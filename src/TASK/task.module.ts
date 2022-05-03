import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CharacterController from './controllers/character.controller';
import CommentController from './controllers/comment.controller';
import EpisodeController from './controllers/episode.controller';
import LocationController from './controllers/location.controller';
import Character from './entities/character.entity';
import Comments from './entities/comments.entity';
import Episode from './entities/episode.entity';
import Location from './entities/location.entity';
import CharacterService from './services/character.service';
import CommentService from './services/comment.service';
import EpisodeService from './services/episode.service';
import LocationService from './services/location.service';

@Module({
  imports: [TypeOrmModule.forFeature([Character, Location, Episode, Comments])],
  controllers: [CharacterController, CommentController, EpisodeController, LocationController],
  providers: [CharacterService, LocationService, CommentService, EpisodeService]
})
export class TaskModule {}
