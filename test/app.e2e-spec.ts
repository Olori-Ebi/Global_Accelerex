import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import entities from '../src/TASK/entities';
import { TaskModule } from '../src/TASK/task.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import CharacterService from '../src/TASK/services/character.service';
import { getConnection, Repository } from 'typeorm';
import Character from '../src/TASK/entities/character.entity';
import LocationDto from '../src/TASK/dtos/location.dto';
import CharacterDto from '../src/TASK/dtos/character.dto';
import { Gender, Status } from '../src/TASK/enum/index.enum';
import EpisodeDto from '../src/TASK/dtos/episode.dto';
import CommentDto from '../src/TASK/dtos/comment.dto';
import configuration from '../src/commons/config/configuration';
import { ConfigModule } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let characterService: CharacterService;
  let characterRepository: Repository<Character>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({
        load: [configuration],
      }),TaskModule,TypeOrmModule.forRoot({
        type: 'mysql',
        port: 3307,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'testdb',
        entities: [...entities],
        synchronize: true,
      })]
    }).compile();

    characterService = moduleFixture.get<CharacterService>(CharacterService)
    characterRepository = moduleFixture.get<Repository<Character>>(getRepositoryToken(Character));
    
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await getConnection().synchronize(true);
    await app.close();
  });

  let locationId: number;
  let characterId: number;
  let episodeId: number;

  describe('GET /hello', () => {
    describe('when calling the endpoint', () => {
      it('should make a request (GET)', () => {
        return request(app.getHttpServer())
          .get('/hello')
          .expect(200)
          .expect('Hello !');
      });
    });
  });

  describe('POST /location', () => {
    describe('when calling the endpoint', () => {
      const location:LocationDto = {
        "name": "Ondo",
        "longitude": 2.878926,
        "latitude": 6.822807
      }
      it('should make a request to create location (POST)', async () => {
        const result = await request(app.getHttpServer())
          .post('/location')
          .send(location)
          .expect(201)
          expect(result.body).toHaveProperty('id');
          locationId = result.body['id'];
      });
    });
  });

  describe('GET /location', () => {
    describe('when calling the endpoint', () => {
      it('should make a request to get characters (GET)', async () => {
        const result = await request(app.getHttpServer())
          .get('/location')
          .expect(200)
          expect(result.body.length).toBe(1)
      });
    });
  });

  describe('POST /:locationId/character', () => {
    describe('when calling the endpoint', () => {
      const character: CharacterDto = {
        "firstName": "Seunayo",
        "lastName": "Eyiyemi",
        "status": Status.ACTIVE,
        "gender": Gender.FEMALE
      }
      it('should make a request to create a character (POST)', async () => {
        const result = await request(app.getHttpServer())
          .post(`/${locationId}/character`)
          .send(character)
          .expect(201)
          expect(result.body).toHaveProperty('id')
          characterId = result.body['id']
      });
    });
  });

  describe('POST /:characterId/episode', () => {
    describe('when calling the endpoint', () => {
      const episode: EpisodeDto = {
        "name": "oloriebi",
        "episodeCode": "oloriebi11",
        "releaseDate": new Date(), 
      }
      it('should make a request to create an episode (POST)', async () => {
        const result = await request(app.getHttpServer())
          .post(`/${characterId}/episode`)
          .send(episode)
          .expect(201)
          expect(result.body).toHaveProperty('id')
          episodeId = result.body['id'];
          
      });
    });
  });
  
  describe('GET /episodes', () => {
    describe('when calling the endpoint', () => {
      it('should make a request to get episodes (GET)', async () => {
        const result = await request(app.getHttpServer())
          .get('/episodes')
          .expect(200)
          expect(result.body.length).toBe(1)
      });
    });
  });

  describe('POST /:characterId/episode/:episodeId/comment', () => {
    describe('when calling the endpoint', () => {
      const comment: CommentDto = {
        "comment": "My firsset comment"
      }
      it('should make a request to make a comment on an episode (POST)', async () => {
        
        const result = await request(app.getHttpServer())
          .post(`/${characterId}/episode/${episodeId}/comment`)
          .send(comment)
          .expect(201)
          expect(result.body).toHaveProperty('id');
          
      });
    });
  });

  
  describe('GET /:characterId/episode/:episodeId/comments', () => {
    describe('when calling the endpoint', () => {
      it('should make a request to get comments on an episode (GET)', async () => {
        const result = await request(app.getHttpServer())
          .get(`/${characterId}/episode/${episodeId}/comments`)
          .expect(200)
          expect(result.body).toHaveProperty('id');
      });
    });
  });
});
