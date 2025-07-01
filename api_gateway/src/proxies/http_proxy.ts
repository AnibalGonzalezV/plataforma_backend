import { Request, Response, RequestHandler } from 'express'
import axios from 'axios'

const httpProxy = (target: string): RequestHandler => {
	return async (req: Request, res: Response) => {
		try {
			const targetUrl = new URL(req.url, target).toString()
			console.log(`[Proxy] ${req.method} -> ${targetUrl}`)

			// Copia los headers originales
			const headers = {
				...req.headers,
				'x-user-id': req.headers['x-user-id'],
				'x-user-email': req.headers['x-user-email'],
				'x-user-roles': req.headers['x-user-roles'],
			}

			// ❌ Elimina headers conflictivos
			delete headers['host']
			delete headers['content-length']
			delete headers['transfer-encoding']

			const response = await axios({
				method: req.method,
				url: targetUrl,
				headers,
				data: req.body,
				params: req.query,
				validateStatus: () => true, // Evita que Axios lance errores por status 4xx/5xx
			})

			res.status(response.status).json(response.data)
		} catch (error: any) {
			console.error(`[Proxy Error] ${error.message}`)
			const status = error.response?.status || 500
			const data = error.response?.data || {
				message: 'Error interno del proxy',
			}
			res.status(status).json(data)
		}
	}
}

export default httpProxy
