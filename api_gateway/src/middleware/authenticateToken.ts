import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

const JWT_SECRET = process.env.JWT_SECRET

export function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const token = req.header('Authorization')?.replace('Bearer ', '')

	if (!token) {
		res.status(401).json({ message: 'Access token is missing' })
		return
	}

	if (!JWT_SECRET) {
		res.status(500).json({ message: 'JWT secret is not configured' })
		return
	}

	jwt.verify(token, JWT_SECRET, (err, payload) => {
		if (err) {
			res.status(403).json({ message: 'Invalid access token' })
			return
		}

		const { sub, roles, email } = payload as any
		const roleNames = roles.map((role: { name: string }) => role.name)

		req.headers['x-user-id'] = sub
		req.headers['x-user-email'] = email
		req.headers['x-user-roles'] = JSON.stringify(roleNames)
		next()
	})
}
