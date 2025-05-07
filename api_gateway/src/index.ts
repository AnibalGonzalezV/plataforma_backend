import cors from 'cors'
import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.get('/', (_, res) => {
	res.json({ message: 'API Gateway is running' })
})

app.use(
	'/users',
	createProxyMiddleware({
		target: 'http://user-service:3002',
		changeOrigin: true,
		pathRewrite: { '^/users': '' },
	})
)

app.use(
	'/auth',
	createProxyMiddleware({
		target: 'http://auth-service:3001',
		changeOrigin: true,
	})
)

app.listen(port, () => {
	console.log(`API Gateway is running at http://localhost:${port}`)
})
