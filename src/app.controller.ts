import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';

@Controller({
  version: VERSION_NEUTRAL, // doesnt need spesific version
})
export class AppController {
  @Get('health')
  health() {
    return { status: 'ok', uptime: process.uptime() };
  }
}
