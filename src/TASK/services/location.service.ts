import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Location from '../entities/location.entity';

export default class LocationService {
  constructor(
    @InjectRepository(Location) private locationModel: Repository<Location>
  ) {}

  async getHello(): Promise<string> {
    return 'Hello !';
  }
  async createLocation(name: string, longitude: number, latitude: number): Promise<Location> {
      const location = this.locationModel.create({ name, longitude, latitude });
      return await this.locationModel.save(location);
  }

  async getLocations(): Promise<Location[]> {
      return await this.locationModel.find();
  }

  async getLocation(locationId: number): Promise<Location> {
    const location = await this.locationModel.findOne({ where: { id: locationId } });
    if(!location) {
      throw new NotFoundException(`Location with ID "${locationId}" not found`);
    }
    return location;
  }
}