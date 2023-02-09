import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { faker } from '@faker-js/faker';
import { TestModule } from './test.module';
import { demoCategory } from './category/category.mock';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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

    it('/user/auth/register (POST)', async () => {
      return await request(app.getHttpServer())
        .post('/user/auth/register')
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

    it('/user/auth/login (POST)', async () => {
      console.log(email, password);
      return await request(app.getHttpServer())
        .post('/user/auth/login')
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

    it('/account (GET)', async () => {
      return await request(app.getHttpServer())
        .get('/user/account')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe(true);
        });
    });

    it('/user/auth/forgot-password (POST)', async () => {
      return await request(app.getHttpServer())
        .post('/user/auth/forgot-password')
        .send({
          email: email,
        })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe(true);
        });
    });

    it('/user/auth/reset-password (POST)', async () => {
      return await request(app.getHttpServer())
        .post('/user/auth/reset-password')
        .send({
          password: 'password',
          code: '123456',
        })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe(true);
        });
    });

    it('/user/account (PUT)', async () => {
      return await request(app.getHttpServer())
        .put('/user/account')
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

    it('/account/password (PUT)', async () => {
      return await request(app.getHttpServer())
        .put('/user/account/password')
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
    console.log(token);
    it('/category (POST)', async () => {
      return await request(app.getHttpServer())
        .post('/category')
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

    it('/category (GET)', async () => {
      return await request(app.getHttpServer())
        .get('/category')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe(true);
        });
    });

    it('/category/:id (GET)', async () => {
      return await request(app.getHttpServer())
        .get('/category/' + categoryId)
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe(true);
        });
    });

    it('/category/:id (GET)', async () => {
      return await request(app.getHttpServer())
        .put('/category/' + categoryId)
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

  describe('Logout after', () => {
    it('/user/account/logout (PUT)', async () => {
      return await request(app.getHttpServer())
        .post('/user/logout')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.status).toBe(true);
        });
    });
  });
});
