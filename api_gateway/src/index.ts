import cors from 'cors'
import express from 'express'
import path from 'path'
import httpProxy from './proxies/http_proxy'
import storeImagesRoutes from './routes/store-images'
import productImageRoutes from './routes/products-images'
import { authenticateToken } from './middleware/authenticateToken'
import { authorizeRoles } from './middleware/authorizeRoles'

const app = express()
const port = 3003

app.use(cors())
app.use(express.json())

//Archivos estáticos
app.use('/public', express.static(path.join(__dirname, '../public')))

app.get('/', (_, res) => {
	res.json({ message: 'API Gateway is running' })
})

//Rutas especiales para imágenes de tiendas y productos
app.use('/store-images', storeImagesRoutes)
app.use('/product-images', productImageRoutes)

//Rutas protegidas específicas
app.post(
	'/products',
	authenticateToken,
	authorizeRoles('vendedor', 'administrador'),
	(req, res, next) => {
		httpProxy('http://products-service:3006')(req, res, next)
	}
)

app.patch(
	'/products',
	authenticateToken,
	authorizeRoles('vendedor', 'administrador'),
	(req, res, next) => {
		httpProxy('http://products-service:3006')(req, res, next)
	}
)

app.patch(
	'/usuarios/change-password',
	authenticateToken,
	httpProxy('http://user-service:3002')
)

app.patch(
	'/usuarios/:id/roles',
	authenticateToken,
	authorizeRoles('administrador'),
	httpProxy('http://user-service:3002')
)

app.get(
	'/usuarios/count-by-role',
	authenticateToken,
	authorizeRoles('administrador'),
	httpProxy('http://user-service:3002')
)

app.patch(
	'/usuarios/:id/disable',
	authenticateToken,
	authorizeRoles('administrador'),
	httpProxy('http://user-service:3002')
)

app.patch(
	'/usuarios/:id/enable',
	authenticateToken,
	authorizeRoles('administrador'),
	httpProxy('http://user-service:3002')
)
//Rutas publicas

app.use('/users', httpProxy('http://user-service:3002'))

app.use('/auth', httpProxy('http://auth-service:3001'))

app.use('/orders', httpProxy('http://orders-service:3005'))

app.use('/metrics', httpProxy('http://metrics-service:3004'))

app.use('/products', httpProxy('http://products-service:3006'))

app.use('/reviews', httpProxy('http://reviews-service:3007'))

app.listen(port, () => {
	console.log(`API Gateway is running at http://localhost:${port}`)
})
