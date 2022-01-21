import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { UserModel } from '../models/users';
import { SignInInterface, UpdateUserInterface, UserSchemaInterface } from '../interfaces/user.interface';
import { EnvConfigService } from '../configs/env.config';

export class UserController {
    private secret: string;
    private Users!: Model<UserSchemaInterface>;
    private salt: number;

    constructor(private userModel: UserModel, private config: EnvConfigService) {
        this.secret = this.config.Secret;
        this.getUserModel();
        this.salt = this.config.bcryptSalt;
    }

    private async getUserModel(): Promise<void> {
        this.Users = await this.userModel.register();
    }

    public async signin(req: Request, res: Response) {
        const { user, password } = req.body as SignInInterface;

        const User = await this.Users.findOne({ user }).select('+password');
        if (!User) {
            return res.status(400).json({ error: 'invalid username or password' });
        }
        if (!await bcrypt.compare(password, User.password as string)) {
            return res.status(400).json({ error: 'invalid username or password' });
        }

        User.password = undefined;
        const token = this.generateToken(User._id);
        const savedSessions = User.sessions || [];
        if (savedSessions.length >= 10) {
            savedSessions.splice(0, 1);
        }
        savedSessions.push(token);
        const response = this.clearPrivateFields(await this.Users.findByIdAndUpdate(User._id, { sessions: savedSessions }) as UserSchemaInterface);
        return res.status(200).json({ user: response, token });
    }

    public async signup(req: Request, res: Response) {
        try {
            if (await this.Users.findOne({ user: req.body.user })) {
                return res.json('user already in use');
            }
            if (await this.Users.findOne({ email: req.body.email })) {
                return res.json('email already in use');
            }
            const hash = bcrypt.hashSync(req.body.password, this.salt);

            const user = this.clearPrivateFields(await this.Users.create({
                name: req.body.name,
                user: req.body.user,
                email: req.body.email,
                password: hash,
            }));
            return res.send({
                user,
                token: this.generateToken(user.id),
            });
        } catch (err) {
            return res.json({ error: 'error when registering' });
        }
    }

    public async updateUser(req: Request, res: Response) {
        const {
            name, email, user, password,
        } = req.body as UpdateUserInterface;

        const User = await this.Users.findOne({ user });
        if (!User || !await bcrypt.compare(password, User.password as string)) {
            return res.status(400).json({ error: 'user not found' });
        }
        const response = this.clearPrivateFields(await this.Users.findByIdAndUpdate(User.id, { name, email }, { new: true }) as UserSchemaInterface);
        return res.send({ response });
    }

    public async validateUser(req: Request, res: Response) {
        const { user } = req.query;
        const User = await this.Users.findOne({ user });
        if (!User) {
            return res.status(400).json({ error: 'user not found' });
        }
        return res.status(200).send({ valid: 'User Registered' });
    }

    private clearPrivateFields(user: UserSchemaInterface): UserSchemaInterface {
        const User = user;
        User.password = undefined;
        User.sessions = undefined;
        return User;
    }

    private generateToken(id: string) {
        return jwt.sign({ id }, this.secret, {
            expiresIn: 85999,
        });
    }
}
