import { DbSaveSurveyResult } from '@data/usecases/survey-result/save-survey-result/db-save-survey-result'
import { SaveSurveyResult } from '@domain/usecases/survey-result/save-survey-result'
import { SurveyResultMongoRepository } from '@infrastructure/db/mongodb/survey-result/survey-result-mongo-repository'

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const saveSurveyResultRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(saveSurveyResultRepository)
}