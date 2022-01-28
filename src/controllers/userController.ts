import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import EnvConfigService from '@configs/env.config';
import { SignInInterface, UpdateUserInterface, UserSchemaInterface } from '@interfaces/user.interface';
import { emailRegexp } from '@configs/regex.config';

export class UserController {
    private secret: string;
    private salt: number;
    private config: EnvConfigService;

    constructor(private Users: Model<UserSchemaInterface>) {
        this.config = new EnvConfigService();
        this.salt = this.config.bcryptSalt;
        this.secret = this.config.Secret;
    }

    public async signin(req: Request, res: Response) {
        const { user, password } = req.body as SignInInterface;

        let User: UserSchemaInterface;
        if (emailRegexp.test(user)) {
            User = await this.Users.findOne({ email: user }).select('+password');
        } else {
            User = await this.Users.findOne({ user }).select('+password');
        }

        if (!User) {
            return res.status(400).json({ error: 'invalid username or password' });
        }
        if (!(await bcrypt.compare(password, User.password as string))) {
            return res.status(400).json({ error: 'invalid username or password' });
        }

        User.password = undefined;
        const token = this.generateToken(User._id);
        const savedSessions = User.sessions || [];
        if (savedSessions.length >= 10) {
            savedSessions.splice(0, 1);
        }
        savedSessions.push(token);
        const response = this.clearPrivateFields(
            (await this.Users.findByIdAndUpdate(User._id, { sessions: savedSessions })) as UserSchemaInterface,
        );
        return res.status(200).json({ user: response, token });
    }

    public async signup(req: Request, res: Response) {
        const { name, email, user, password } = req.body as UserSchemaInterface;
        try {
            if (!emailRegexp.test(email)) {
                return res.status(400).json({ error: 'invalid email' });
            }
            if (password.length < 8) {
                return res.status(400).json({ error: 'password must be at least 8 characters long' });
            }
            if (await this.Users.findOne({ user })) {
                return res.json('user already in use');
            }
            if (await this.Users.findOne({ email })) {
                return res.json('email already in use');
            }
            const hash = bcrypt.hashSync(password, this.salt);

            const newUser = this.clearPrivateFields(
                await this.Users.create({
                    name,
                    user,
                    email,
                    password: hash,
                }),
            );
            return res.send({
                user: newUser,
                token: this.generateToken(newUser.id),
            });
        } catch (err) {
            return res.json({ error: 'error when registering' });
        }
    }

    public async updateUser(req: Request, res: Response) {
        const { name, email, user, password, newPassword } = req.body as UpdateUserInterface;

        if (!emailRegexp.test(email)) {
            return res.status(400).json({ error: 'invalid email' });
        }
        const User = await this.Users.findOne({ user });
        if (!User || !(await bcrypt.compare(password, User.password as string))) {
            return res.status(400).json({ error: 'user not found' });
        }
        if (email !== User.email) {
            return res.status(400).json({ error: 'invalid email or username' });
        }
        const response = this.clearPrivateFields(
            (await this.Users.findByIdAndUpdate(
                User.id,
                { name, password: newPassword },
                { new: true },
            )) as UserSchemaInterface,
        );
        return res.send({ response });
    }

    public async validateUser(req: Request, res: Response) {
        const { user, email } = req.query;

        if (user) {
            const User = await this.Users.findOne({ user });
            if (!User) {
                return res.status(200).json({ valid: false });
            }
            return res.status(200).send({ valid: true });
        }
        if (email) {
            const User = await this.Users.findOne({ email });
            if (!User) {
                return res.status(200).json({ valid: false });
            }
            return res.status(200).send({ valid: true });
        }

        return res.status(400).json({ error: 'user or email not found' });
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
