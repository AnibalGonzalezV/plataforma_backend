import { Request, Response, NextFunction } from 'express'

export function authorizeRoles(...allowedRoles: string[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		const rolesHeader = req.headers['x-user-roles']

		if (!rolesHeader) {
			res.status(403).json({ message: 'Access denied: No roles provided' })
			return
		}

		const userRoles: string[] = JSON.parse(rolesHeader as string)

		const hasAccess = allowedRoles.some((role) => userRoles.includes(role))
		if (!hasAccess) {
			res
				.status(403)
				.json({ message: 'Access denied: Insufficient permissions' })
			return
		}

		next()
	}
}
