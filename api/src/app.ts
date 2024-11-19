import cors from 'cors'
import express, { Express } from 'express'
import dotenv from 'dotenv'

import { API_VERSION } from './constants'
import routeV1 from './routes'
import './crons'

import camelCaseResponseMiddleware from './middlewares/camelcase.middleware'
import snakeCaseRequestMiddleware from './middlewares/snakecase.middleware'

dotenv.config()
const app: Express = express()

app.use(express.json())

const whitelist = (process.env.WHITELIST_CORS_URL || '').split(',').map((url) => url.trim())
const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))
app.use(snakeCaseRequestMiddleware)
app.use(camelCaseResponseMiddleware)

app.use(API_VERSION.V1, routeV1)

export default app
