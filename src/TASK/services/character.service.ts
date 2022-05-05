// import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CharacterDto from '../dtos/character.dto';
import { FilterDto } from '../dtos/filter.dto';
import Character from '../entities/character.entity';
import Location from '../entities/location.entity';

export default class CharacterService {
  constructor(
    @InjectRepository(Character) private characterModel: Repository<Character>,
  ) {}

  async getHello(): Promise<string> {
    return 'Hello !';
  }

  async getCharacters(filterDto: FilterDto) {
    const { gender, status, sort, sortValue, location } = filterDto;
    const builder = this.characterModel
      .createQueryBuilder('character')
      .innerJoinAndSelect('character.location', 'location');

    if (status) {
      builder.andWhere('character.status = :status', { status });
    }

    if (gender) {
      builder.andWhere('character.gender = :gender', { gender });
    }

    if (location) {
      builder.andWhere('location.name = :location', { location });
    }

    if (sortValue === 'location' && sort) {
      builder.orderBy('location.name', sort);
    } else if (sortValue === 'gender' && sort) {
      builder.orderBy('character.gender', sort);
    }

    return await builder.getMany();
  }

  async createCharacter(
    body: CharacterDto,
    location: Location,
  ): Promise<Character> {
    const character = this.characterModel.create({
      firstName: body.firstName,
      lastName: body.lastName,
      gender: body.gender,
      status: body.status,
    });
    character.location = location;

    return this.characterModel.save(character);
  }

  async getCharacter(id: number): Promise<Character> {
    return await this.characterModel.findOne({
      where: { id },
    });
  }
}
