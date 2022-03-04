import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import EnvConfigService from '@configs/env.config';
import { SignInInterface, UpdateUserInterface, UserSchemaInterface } from '@interfaces/user.interface';
import { emailRegexp } from '@configs/regex.config';
import { Users } from 'entity/users';
import { Repository } from 'typeorm';

export class UserController {
    private secret: string;
    private salt: number;

    constructor(private UsersRepository: Repository<Users>, private config: EnvConfigService) {
        this.salt = this.config.bcryptSalt;
        this.secret = this.config.Secret;
    }

    public async signin(req: Request, res: Response) {
        const { user, password } = req.body as SignInInterface;

        let UserDB: Users;
        if (emailRegexp.test(user)) {
            UserDB = await this.UsersRepository.findOne({ email: user });
        } else {
            UserDB = await this.UsersRepository.findOne({ user });
        }

        if (!UserDB) {
            return res.status(400).json({ error: 'invalid username or password' });
        }
        if (!(await bcrypt.compare(password, UserDB.password))) {
            return res.status(400).json({ error: 'invalid username or password' });
        }

        const token = this.generateToken(UserDB._id.toString());
        const savedSessions = UserDB.sessions || [];
        if (savedSessions.length >= 10) {
            savedSessions.splice(0, 1);
        }
        savedSessions.push(token);
        UserDB.sessions = savedSessions;
        await this.UsersRepository.update({ _id: UserDB._id }, UserDB);
        const response = this.clearPrivateFields(UserDB);
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
            if (await this.UsersRepository.findOne({ user })) {
                return res.json({ message: 'user already in use' });
            }
            if (await this.UsersRepository.findOne({ email })) {
                return res.json({ message: 'email already in use' });
            }
            const hash = bcrypt.hashSync(password, this.salt);

            const newUser = this.clearPrivateFields(
                await this.UsersRepository.save({
                    name,
                    user,
                    email,
                    password: hash,
                    sessions: [],
                }),
            );
            return res.send({
                user: newUser,
                token: this.generateToken(newUser._id.toString()),
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
        const UserDB = await this.UsersRepository.findOne({ user });
        if (!UserDB || !(await bcrypt.compare(password, UserDB.password as string))) {
            return res.status(400).json({ error: 'user not found' });
        }
        if (email !== UserDB.email) {
            return res.status(400).json({ error: 'invalid email or username' });
        }
        if (newPassword) {
            UserDB.password = bcrypt.hashSync(newPassword, this.salt);
        }
        UserDB.name = name;
        const savedUser = await this.UsersRepository.update({ _id: UserDB._id }, UserDB);

        if (savedUser.affected) {
            return res.status(200).json({ user: this.clearPrivateFields(UserDB) });
        }
        return res.json({ error: 'error when updating user' });
    }

    public async validateUser(req: Request, res: Response) {
        const { user, email } = req.query as { user?: string; email?: string };
        if (user) {
            const UserDB = await this.UsersRepository.findOne({ user });
            if (!UserDB) {
                return res.status(200).json({ valid: false });
            }
            return res.status(200).send({ valid: true });
        }
        if (email) {
            const UserDB = await this.UsersRepository.findOne({ email });
            if (!UserDB) {
                return res.status(200).json({ valid: false });
            }
            return res.status(200).send({ valid: true });
        }

        return res.status(400).json({ error: 'user or email not found' });
    }

    public async deleteUser(req: Request, res: Response) {
        const { user, password } = req.body as { user: string; password: string };

        const UserDB = await this.UsersRepository.findOne({ user });

        if (!UserDB || !(await bcrypt.compare(password, UserDB.password))) {
            return res.status(400).json({ error: 'invalid username, email or password' });
        }

        await this.UsersRepository.delete(UserDB._id);

        return res.status(200).json({ message: 'User deleted' });
    }

    private clearPrivateFields(user: Users): Users {
        const UserDB = user;
        UserDB.password = undefined;
        UserDB.sessions = undefined;
        return UserDB;
    }

    private generateToken(id: string) {
        return jwt.sign({ id }, this.secret, {
            expiresIn: 85999,
        });
    }
}
