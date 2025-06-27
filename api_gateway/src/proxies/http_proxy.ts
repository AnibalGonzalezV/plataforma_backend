import { Request, Response, RequestHandler } from 'express'
import axios from 'axios'

const httpProxy = (target: string): RequestHandler => {
	return async (req: Request, res: Response) => {
		try {
			const targetUrl = new URL(req.url, target).toString()

			// Debug opcional:
			console.log(`[Proxy] ${req.method} -> ${targetUrl}`)

			const headers = { ...req.headers } as Record<string, string>
			delete headers.host

			const isGetOrDelete = ['GET', 'DELETE'].includes(req.method.toUpperCase())
			const body = isGetOrDelete ? undefined : req.body

			const response = await axios.request({
				method: req.method,
				url: targetUrl,
				headers,
				data: body,
				params: req.query,
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
