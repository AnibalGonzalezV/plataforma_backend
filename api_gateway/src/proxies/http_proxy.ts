import { Request, RequestHandler, Response } from 'express'
import axios from 'axios'

const httpProxy = (target: string): RequestHandler => {
	return async (req, res) => {
		const proxiedPath = req.originalUrl.replace(req.baseUrl, '') || '/'
		const targetUrl = new URL(proxiedPath, target).toString()

		try {
			// Prepara el body
			const bodyString = JSON.stringify(req.body || {})
			// Copia y ajusta las cabeceras
			const headers = { ...req.headers } as Record<string, string>
			delete headers.host
			headers['content-type'] = 'application/json'
			headers['content-length'] = Buffer.byteLength(bodyString).toString()

			const response = await axios.request({
				method: req.method,
				url: targetUrl,
				data: bodyString,
				headers,
				params: req.query,
				// si usas cookies o auth, quizá necesites: withCredentials: true
			})

			res.status(response.status).json(response.data)
		} catch (error: any) {
			res
				.status(error.response?.status || 500)
				.json({ error: error.response?.data || error.message })
		}
	}
}

export default httpProxy
