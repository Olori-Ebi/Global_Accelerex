import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Comments from "../entities/comments.entity";
import Episode from "../entities/episode.entity";

export default class CommentService {
  constructor(
   @InjectRepository(Comments) private commentsModel: Repository<Comments>,
   @InjectRepository(Episode) private episodeModel: Repository<Episode>
  ) {}

  async createComment(episode:Episode, ipAddressLocation: string, comment: string): Promise<Comments> {
      const data = { ipAddressLocation, comment };
    
      const result = this.commentsModel.create(data)
      
      episode.comments.push(result)

      await this.episodeModel.save(episode)
      return await this.commentsModel.save(result)
  }
}