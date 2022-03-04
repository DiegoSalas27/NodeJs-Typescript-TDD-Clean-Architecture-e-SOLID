import { mockLoadSurveysRepository } from '@data/test'
import { mockSurveysModels, throwError } from '@domain/test'
import MockDate from 'mockdate'
import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveys, LoadSurveysRepository } from './db-load-surveys-protocols'

type SutTypes = {
  sut: LoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

  return {
    sut,
    loadSurveysRepositoryStub
  }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveysRepository', async () => {
    const { loadSurveysRepositoryStub, sut } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })

  test('Should return a list of Surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(mockSurveysModels())
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { loadSurveysRepositoryStub, sut } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockImplementationOnce(throwError)
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
