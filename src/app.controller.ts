import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      name: 'GoShopp API',
      status: 'online',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
