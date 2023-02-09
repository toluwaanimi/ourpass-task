import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { faker } from '@faker-js/faker';
import { TestModule } from './test.module';
import { demoCategory } from './category/category.mock';
import { demoPost } from './post/post.mock';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('/api/v1/');
    await app.init();
  });

  afterAll(async () => {
    await getConnection().synchronize(true);
    await app.close();
  });

  let token = '';
  let categoryId = '';
  let postId = '';

  describe('User Routes', () => {
    const email = faker.internet.email();
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const password = 'password';
    const phoneNumber = '+23481' + faker.random.numeric(8);

    it('/api/v1/user/register (POST)', async () => {
      return await request(app.getHttpServer())
        .post('/api/v1/user/register')
        .send({
          email: email,
          first_name: firstName,
          last_name: lastName,
          password: password,
          phone_number: phoneNumber,
        })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe(true);
        });
    });

    it('/api/v1/user/login (POST)', async () => {
      return await request(app.getHttpServer())
        .post('/api/v1/user/login')
        .send({
          email: email,
          password: password,
        })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe(true);
          token = res.body.data.token;
        });
    });

    it('/api/v1/user/account (GET)', async () => {
      return await request(app.getHttpServer())
        .get('/api/v1/user/account')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe(true);
        });
    });

    it('/api/v1/user/forgot-password (POST)', async () => {
      return await request(app.getHttpServer())
        .post('/api/v1/user/forgot-password')
        .send({
          email: email,
        })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe(true);
        });
    });

    it('/api/v1/user/reset-password (POST)', async () => {
      return await request(app.getHttpServer())
        .post('/api/v1/user/reset-password')
        .send({
          password: 'password',
          code: '123456',
        })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe(true);
        });
    });

    it('/api/v1/user/account (PUT)', async () => {
      return await request(app.getHttpServer())
        .put('/api/v1/user/account')
        .send({
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
        })
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe(true);
        });
    });

    it('/api/v1/account/password (PUT)', async () => {
      return await request(app.getHttpServer())
        .put('/api/v1/user/account/password')
        .send({
          password: password,
          old_password: password,
        })
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe(true);
        });
    });
  });

  describe('Category Routes', () => {
    it('/api/v1/category (POST)', async () => {
      return await request(app.getHttpServer())
        .post('/api/v1/category')
        .send({
          name: demoCategory.name,
          slug: demoCategory.slug,
        })
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe(true);
          categoryId = res.body.data.id;
        });
    });

    it('/api/v1/category (GET)', async () => {
      return await request(app.getHttpServer())
        .get('/api/v1/category')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe(true);
        });
    });

    it('/api/v1/category/:id (GET)', async () => {
      return await request(app.getHttpServer())
        .get('/api/v1/category/' + categoryId)
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe(true);
        });
    });

    it('/api/v1/category/:id (PUT)', async () => {
      return await request(app.getHttpServer())
        .put('/api/v1/category/' + categoryId)
        .send({
          name: demoCategory.name,
          slug: demoCategory.slug,
        })
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe(true);
        });
    });
  });

  describe('Post Routes', () => {
    it('/api/v1/post (POST)', async () => {
      return await request(app.getHttpServer())
        .post('/api/v1/post')
        .send({
          name: demoPost.name,
          text: demoPost.text,
          categoryId: categoryId,
        })
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe(true);
          postId = res.body.data.id;
        });
    });

    it('/api/v1/post (GET)', async () => {
      return await request(app.getHttpServer())
        .get('/api/v1/post')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe(true);
        });
    });

    it('/api/v1/post/:id (GET)', async () => {
      return await request(app.getHttpServer())
        .get('/api/v1/post/' + postId)
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe(true);
        });
    });

    it('/api/v1/post/:id (PUT)', async () => {
      return await request(app.getHttpServer())
        .put('/api/v1/post/' + postId)
        .send({
          name: demoPost.name,
          text: demoPost.text,
          categoryId: categoryId,
        })
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe(true);
        });
    });
  });

  describe('Logout after', () => {
    it('/api/v1/user/account/logout (PUT)', async () => {
      return await request(app.getHttpServer())
        .post('/api/v1/user/logout')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe(true);
        });
    });
  });
});
