import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameStorageSchema } from '../../schemas/storage.schema';
import { MongodbService } from './mongodb.service';

const mongoProtocol = process.env.STORAGE_MONGODB_PROTOCOL;
const mongoHost = process.env.STORAGE_MONGODB_HOST;
const mongoUsername = process.env.STORAGE_MONGODB_USERNAME;
const mongoPassword = process.env.STORAGE_MONGODB_PASSWORD;
const mongoDatabase = process.env.STORAGE_MONGODB_DATABASE;

@Module({
  imports: [
    MongooseModule.forRoot(`${mongoProtocol}://${mongoUsername}:${mongoPassword}@${mongoHost}/${mongoDatabase}`),
    MongooseModule.forFeature([{ name: 'GameStorage', schema: GameStorageSchema, collection: 'name' }])
  ],
  providers: [MongodbService],
  exports: [MongodbService,MongooseModule]
})
export class MongodbModule {}