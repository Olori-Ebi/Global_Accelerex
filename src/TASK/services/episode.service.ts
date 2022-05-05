import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Character from '../entities/character.entity';
import Episode from '../entities/episode.entity';

export default class EpisodeService {
  constructor(
    @InjectRepository(Character) private characterModel: Repository<Character>,
    @InjectRepository(Episode) private episodeModel: Repository<Episode>,
  ) {}

  async getHello(): Promise<string> {
    return 'Hello !';
  }

  async getEpisodes() {
    const builder = this.episodeModel
      .createQueryBuilder('episodes')
      .leftJoinAndSelect('episodes.comments', 'comments')
      .loadRelationCountAndMap('episodes.commentsCount', 'episodes.comments')
      .orderBy('episodes.releaseDate', 'ASC');

    return await builder.getMany();
  }

  async createEpisode(
    character: Character,
    name: string,
    episodeCode: string,
    releaseDate: Date,
  ): Promise<Episode> {
    const data = {
      name,
      episodeCode,
      releaseDate,
    };
    const result = this.episodeModel.create(data);
    
    character.episodes.push(result);
    await this.characterModel.save(character);

    return await this.episodeModel.save(result);
  }

  async getEpisode( episodeId: number): Promise<Episode> {
    return await this.episodeModel.findOne({ where: {id: episodeId}})
  }
}
