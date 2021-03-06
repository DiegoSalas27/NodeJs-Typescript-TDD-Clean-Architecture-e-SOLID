import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '@infrastructure/db/mongodb/helpers/mongo-helper'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  })
  afterAll(async () => {
    await MongoHelper.disconnect();
  })
  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({}); // delete objects in memory so that tests don't overlap
  })

  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
          name: 'Rodrigo',
          email: 'rodrigo.maguino@gmail.com',
          password: '123',
          passwordConfirmation: '123'
      })
      .expect(200)
  })
})