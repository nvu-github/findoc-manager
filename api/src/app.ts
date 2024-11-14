import cors from 'cors'
import express, { Express } from 'express'
import dotenv from 'dotenv'

import { API_VERSION } from './constants'
import routeV1 from './routes'

dotenv.config()
const app: Express = express()

app.use(express.json())
app.use(cors({ origin: '*' }))

app.use(API_VERSION.V1, routeV1)

export default app
