import {
  Controller,
  Get,
  UseGuards,
  Req,
  Param,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    return await this.usersService.findOne(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new BadRequestException('user doesnt exist');
    }

    return user;
  }
}
