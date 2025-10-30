import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import request from 'supertest';
import { Reflector } from '@nestjs/core';

describe('Auth & Posts (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let postId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('register & login', async () => {
    const uniqueEmail = `e2e-${Date.now()}@ex.com`;

    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: uniqueEmail, password: 'secret12' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: uniqueEmail, password: 'secret12' })
      .expect(201);

    token = res.body.access_token;
  });

  it('create post', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Post 01 (test)',
        description: 'Lorem ipsum dolor sit amet.',
      })
      .expect(201);

    postId = res.body.id;
  });

  it('get all posts', async () => {
    await request(app.getHttpServer()).get('/api/v1/posts').expect(200);
  });

  it('update own post', async () => {
    await request(app.getHttpServer())
      .patch(`/api/v1/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Post 01 (updated)' })
      .expect(200);
  });

  it('delete own post', async () => {
    await request(app.getHttpServer())
      .delete(`/api/v1/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
