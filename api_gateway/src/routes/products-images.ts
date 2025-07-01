// Implementar logica de manejo de imagenes de productos
import { Router, Request, Response } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import axios from 'axios'
import { authenticateToken } from '../middleware/authenticateToken'

const router = Router()

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		const dir = path.join(__dirname, '../../public/product-images')
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true }) // Crea la carpeta si no existe
		}
		cb(null, dir)
	},
	filename: (_req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
		const ext = path.extname(file.originalname)
		cb(null, file.fieldname + '-' + uniqueSuffix + ext)
	},
})

const upload = multer({ storage })

router.post(
	'/upload/:productId',
	authenticateToken,
	upload.single('image'),
	async (req: Request, res: Response) => {
		try {
			const productId = Number(req.params.productId)
			const userId = Number(req.headers['x-user-id'])

			if (!req.file) {
				res.status(400).json({ message: 'No file uploaded' })
				return
			}

			const productResponse = await axios.get(
				`http://products-service:3006/products/${productId}`
			)
			const product = productResponse.data

			if (!product) {
				fs.unlinkSync(req.file.path) // Delete the uploaded file if product not found
				res.status(404).json({ message: 'Product not found' })
				return
			}

			const storeId = product.storeId
			const storeResponse = await axios.get(
				`http://user-service:3002/stores/${storeId}`
			)
			const store = storeResponse.data

			if (!store.owner || store.owner.id !== userId) {
				fs.unlinkSync(req.file.path) // Delete the file if store owner not found
				res.status(403).json({ message: 'You are not authorized' })
				return
			}

			const imageUrl = `/public/product-images/${req.file.filename}`

			await axios.patch(
				`http://localhost:3003/products/${productId}`,
				{ imageUrl },
				{
					headers: {
						Authorization: req.headers['authorization'],
						'x-user-id': req.headers['x-user-id'] as string,
						'x-user-email': req.headers['x-user-email'] as string, // opcional
						'x-user-roles': req.headers['x-user-roles'] as string, // reenviamos el token
					},
				}
			)
			res.status(200).json({ message: 'Image uploaded successfully', imageUrl })
		} catch (error) {
			console.error('Error uploading product image:', error)

			if (req.file && fs.existsSync(req.file.path)) {
				fs.unlinkSync(req.file.path) // Delete the file if an error occurs
			}

			res.status(500).json({ message: 'Internal server error' })
		}
	}
)

export default router
