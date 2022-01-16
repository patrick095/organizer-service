import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { UserModel } from 'src/models/users';
import { SignInInterface, UserSchemaInterface } from '../interfaces/user.interface';
import { EnvConfigService } from '../configs/env.config';

export class UserController {
    private secret: string;
    private Users!: Model<UserSchemaInterface>;

    constructor(private userModel: UserModel, private config: EnvConfigService) {
        this.secret = this.config.Secret;
        this.getUserModel();
    }

    public async getUserModel(): Promise<void> {
        this.Users = await this.userModel.register();
    }

    public async signin(req: Request, res: Response) {
        const { user, password } = req.body as SignInInterface;

        const User = await this.Users.findOne({ user }).select('+password');
        if (!User) {
            return res.status(400).json({ error: 'invalid username or password' });
        }
        if (!await bcrypt.compare(password, User.password)) {
            return res.status(400).json({ error: 'invalid username or password' });
        }

        User.password = '';
        const token = this.generateToken(User._id);
        const savedSessions = User.sessions || [];
        if (savedSessions.length >= 10) {
            savedSessions.splice(0, 1);
        }
        savedSessions.push(token);
        await this.Users.findByIdAndUpdate(User._id, { sessions: savedSessions });
        return res.status(200).json({ User, token });
    }

    private generateToken(id: string) {
        return jwt.sign({ id }, this.secret, {
            expiresIn: 85999,
        });
    }
}
