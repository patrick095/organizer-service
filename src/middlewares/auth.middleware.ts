import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import EnvConfigService from '@configs/env.config';

export class AuthMiddleware {
    private secret: string;
    constructor(private config: EnvConfigService) {
        this.secret = this.config.Secret;
    }

    // eslint-disable-next-line consistent-return
    public autenticate(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization as string;
        if (!authHeader) {
            return res.status(401).json({ erro: 'token não informado!' });
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2) {
            return res.status(401).json({ erro: 'token incompleto!' });
        }
        const [scheme, token] = parts;

        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).json({ erro: 'token mal formado!' });
        }

        jwt.verify(token, this.secret, (err, decoded: JwtPayload) => {
            if (err) {
                return res.status(401).json({ erro: 'token inválido!' });
            }
            req.body.userId = decoded?.id;
            return next();
        });
    }
}
