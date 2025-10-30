import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { CurrentUser } from '@auth/current-user.decorator';

@Controller({
  path: 'posts',
  version: '1',
})
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // Create new post
  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreatePostDto,
  ) {
    return this.postsService.create(user.userId, dto);
  }

  // Get all my posts
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async myPosts(
    @CurrentUser() user: { userId: string },
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const s = Number(skip ?? 0);
    const t = Math.min(Number(take ?? 10), 100);

    return this.postsService.findAll({
      skip: s,
      take: t,
      authorId: user.userId,
    });
  }

  // Get all posts
  @Get()
  async findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    const s = Number(skip ?? 0);
    const t = Math.min(Number(take ?? 10), 100);

    return this.postsService.findAll({ skip: s, take: t });
  }

  // Find post by id
  @Get(':id')
  async findById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.postsService.findOne(id);
  }

  // Update own post
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updatePost(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.update(id, user.userId, dto);
  }

  // Delete own post
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.postsService.remove(id, user.userId);
  }
}
