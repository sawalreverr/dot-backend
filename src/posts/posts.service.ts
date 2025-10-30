import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(authorId: string, dto: CreatePostDto) {
    const post = this.postRepository.create({ ...dto, authorId });
    return await this.postRepository.save(post);
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    authorId?: string;
  }): Promise<Post[]> {
    const where: FindOptionsWhere<Post> = {};
    if (params?.authorId) where.authorId = params.authorId;

    return await this.postRepository.find({
      where,
      skip: params?.skip ?? 0,
      take: params?.take ?? 10,
    });
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('post not found');
    }

    return post;
  }

  async update(id: string, authorId: string, dto: UpdatePostDto) {
    const post = await this.findOne(id);
    if (post.authorId !== authorId) {
      throw new ForbiddenException();
    }

    post.updatedAt = new Date();
    Object.assign(post, dto);

    return this.postRepository.save(post);
  }

  async remove(id: string, authorId: string) {
    const post = await this.findOne(id);
    if (post.authorId !== authorId) {
      throw new ForbiddenException();
    }
    await this.postRepository.remove(post);

    return { deleted: true };
  }
}
