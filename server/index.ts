import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import { DataSource } from 'typeorm'
import { Question } from './entity/Question'
import { databaseInfo } from './config'
const PORT = 12500
const AppDataSource = new DataSource({
  ...databaseInfo,
  type: 'mysql',
  entities: [Question],
  synchronize: true,
  logging: false,
})
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!')
  })
  .catch(err => {
    console.error('Error during Data Source initialization:', err)
  })
const questionRepository = AppDataSource.getRepository(Question)
const app = express()
app.use(cors())
app.post('/upload', express.json(), async (req, res) => {
  const { question } = req.body
  try {
    await questionRepository
      .createQueryBuilder()
      .insert()
      .values({ question, isSend: false })
      .execute()
    res.send({ type: 'success', message: '添加成功' })
  } catch (error) {
    console.log(error)
    res.send({ type: 'fail', message: '添加失败' })
  }
})
app.listen(PORT, '127.0.0.1', () => {
  console.log('server start')
})