import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('heathcheck')
  getHello(): string {
    return String(Date.now());
  }
}
