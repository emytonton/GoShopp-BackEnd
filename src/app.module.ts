import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IdentityModule } from './modules/identity/identity.module';
import { StoresModule } from './modules/stores/stores.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    IdentityModule,
    StoresModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
