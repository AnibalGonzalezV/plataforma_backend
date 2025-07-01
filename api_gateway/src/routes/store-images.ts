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
			const user = (req as any).user
			const storeId = Number(req.params.storeId)

			if (!req.file) {
				res.status(400).json({ message: 'No file uploaded' })
				return
			}

			// Validate store ownership
			const storeResponse = await axios.get(
				`http://user-service:3002/stores/${storeId}`
			) // Replace with actual store service URL
			const store = storeResponse.data

			if (!store) {
				fs.unlinkSync(req.file.path) // Delete the file if store not found
				res.status(404).json({ message: 'Store not found' })
				return
			}

			if (store.owner.id !== user.userId) {
				fs.unlinkSync(req.file.path) // Delete the file if user is not the owner
				res.status(403).json({
					message: 'You do not have permission to upload images for this store',
				})
				return
			}

			const imageUrl = `/public/store-images/${req.file.filename}` // Adjust the URL as needed

			await axios.patch(
				`http://user-service:3002/stores/${storeId}`,
				{ imageUrl },
				{
					headers: {
						Authorization: req.headers['authorization'], // Pass the original authorization header
					},
				}
			)

			res.status(200).json({ message: 'Image uploaded successfully', imageUrl })
		} catch (error) {
			console.error('Error uploading image:', error)

			if (req.file && fs.existsSync(req.file.path)) {
				fs.unlinkSync(req.file.path) // Clean up the uploaded file in case of error
			}

			res.status(500).json({ message: 'Internal server error' })
		}
	}
)

export default router
