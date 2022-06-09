import request from 'supertest';
import { app } from '../../app';

it('should return details about current user', async () => {
  const signUpRes = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const cookie = signUpRes.get('Set-Cookie');

  const response = await request(app)
    .get('/api/users/current-user')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser).toBeDefined();
  expect(response.body.currentUser.email).toBe('test@test.com');
});