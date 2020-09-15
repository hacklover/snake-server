import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {NestExpressApplication} from '@nestjs/platform-express';
import * as rateLimit from 'express-rate-limit';

const port = process.env.APP_PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // cors
  app.enableCors();

  // only in production
  app.set('trust proxy', 1);

  // rate limiter
  app.use(
    rateLimit({
      windowMs: Number(process.env.RATE_LIMIT_MOVES_TIMEOUT),
      max: Number(process.env.RATE_LIMIT_MOVES),
      message: { status: false, message: 'Too many requests, please try again later' },
    }),
  );

  await app.listen(port);
}
bootstrap();
