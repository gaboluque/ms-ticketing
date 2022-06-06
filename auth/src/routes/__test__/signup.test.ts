import request from 'supertest';
import { app } from '../../app';

it('should return 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});

it('should return 400 on invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtest.com',
      password: 'password',
    })
    .expect(400);
});

it('should return 400 on invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'ps',
    })
    .expect(400);
});

it('should return 400 on missing credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com"
    })
    .expect(400);
  await request(app)
    .post('/api/users/signup')
    .send({
      password: "myPassword"
    })
    .expect(400);
});

it('should return 400 on duplicate credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('should set cookie on successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});