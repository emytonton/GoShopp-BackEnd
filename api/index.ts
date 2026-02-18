import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { AppModule } from '../src/app.module';

let app: INestApplication;

export default async function bootstrap(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (!app) {
    app = await NestFactory.create(AppModule);
    await app.init();
  }

  const expressInstance = app.getHttpAdapter().getInstance() as (
    request: VercelRequest,
    response: VercelResponse,
  ) => void;

  expressInstance(req, res);
}
