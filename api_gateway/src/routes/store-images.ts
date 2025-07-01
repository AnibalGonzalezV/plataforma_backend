//Implementar logica de manejo de imagenes de tiendas
import { Router, Request, Response } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import axios from 'axios'
import { authenticateToken } from '../middleware/authenticateToken'

const router = Router()

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		const dir = path.join(__dirname, '../../public/store-images')
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
	'/upload/:storeId',
	authenticateToken,
	upload.single('image'),
	async (req: Request, res: Response) => {
		try {
			const storeId = Number(req.params.storeId)
			const userId = Number(req.headers['x-user-id'])

			if (!req.file) {
				res.status(400).json({ message: 'No file uploaded' })
				return
			}

			// Validate store ownership
			const storeResponse = await axios.get(
				`http://user-service:3002/stores/${storeId}`
			)
			const store = storeResponse.data

			if (!store) {
				fs.unlinkSync(req.file.path)
				res.status(404).json({ message: 'Store not found' })
				return
			}

			if (store.owner.id !== userId) {
				fs.unlinkSync(req.file.path)
				res.status(403).json({
					message: 'You do not have permission to upload images for this store',
				})
				return
			}

			const imageUrl = `/public/store-images/${req.file.filename}`

			await axios.patch(
				`http://localhost:3003/stores/${storeId}`,
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
			console.error('Error uploading image:', error)

			if (req.file && fs.existsSync(req.file.path)) {
				fs.unlinkSync(req.file.path)
			}

			res.status(500).json({ message: 'Internal server error' })
		}
	}
)

export default router
