import cors from 'cors'
import express from 'express'
import httpProxy from './proxies/http_proxy'

const app = express()
const port = 3003

app.use(cors())
app.use(express.json())

app.get('/', (_, res) => {
	res.json({ message: 'API Gateway is running' })
})

app.use('/users', httpProxy('http://user-service:3002'))

app.use('/auth', httpProxy('http://auth-service:3001'))

app.use('/orders', httpProxy('http://order-service:3005'))

app.use('/metrics', httpProxy('http://metrics-service:3004'))

app.listen(port, () => {
	console.log(`API Gateway is running at http://localhost:${port}`)
})
