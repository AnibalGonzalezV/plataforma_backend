import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

const JWT_SECRET = 'jwt-secret-key' // Replace with your actual secret key

export function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]

	if (!token) {
		res.status(401).json({ message: 'Access token is missing' })
		return
	}

	jwt.verify(token, JWT_SECRET, (err, payload) => {
		if (err) {
			res.status(403).json({ message: 'Invalid access token' })
			return
		}

		const { sub, roles, email } = payload as any

		req.headers['x-user-id'] = sub
		req.headers['x-user-email'] = email
		req.headers['x-user-roles'] = JSON.stringify(roles)
		next()
	})
}
