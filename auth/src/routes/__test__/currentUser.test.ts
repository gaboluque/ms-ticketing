import request from 'supertest';
import { app } from '../../app';
import { signUp } from "../../test/setup";

it('should return details about current user', async () => {
  const cookie = await signUp();

  const response = await request(app)
    .get('/api/users/current-user')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser).toBeDefined();
  expect(response.body.currentUser.email).toBe('test@test.com');
});

it('should respond with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/current-user')
    .send()
    .expect(200);

  expect(response.body.currentUser).toBeNull();
});