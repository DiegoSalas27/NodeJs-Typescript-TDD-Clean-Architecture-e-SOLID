import { Collection, ObjectId } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository';

let accountCollection: Collection

describe('Account Mongo Repository', () => { // This is an integration test
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  })
  afterAll(async () => {
    await MongoHelper.disconnect();
  })
  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({}); // delete objects in memory so that tests don't overlap
  })

  const makeSut = (): AccountMongoRepository => {
    return  new AccountMongoRepository()
  }

  test('Should return an account on add success', async () => {
    const sut = makeSut();
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy() // ensure is not null
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return an account on loadByEmail success', async () => {
    const sut = makeSut();
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return null if loadByEmail fails', async () => {
    const sut = makeSut();
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeFalsy()
  })

  test('Should update the account accessToken on updateAccessToken success', async () => {
    const sut = makeSut();
    const accountData = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    let { value: account } = await accountCollection.findOneAndUpdate(
      { _id: new ObjectId() },
      { $setOnInsert: accountData },
      { upsert: true, returnDocument: 'after' }
    )
    expect(account.accessToken).toBeFalsy()
    await sut.updateAccessToken(account._id as any, 'any_token')
    account = await accountCollection.findOne({ _id: account._id })
    expect(account).toBeTruthy()
    expect(account.accessToken).toBe('any_token')
  })
})