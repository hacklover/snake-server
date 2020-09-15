import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('api')
  status(): any {
    return { success: true };
  }
}
