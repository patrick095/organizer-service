import express from 'express';
import cors from 'cors';
import { Model } from 'mongoose';

import EnvConfigService from '@configs/env.config';
import { UserController } from '@controllers/userController';
import { DataController } from '@controllers/dataController';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import Routes from './routers/routes';
import database, { Database } from './database';
import { DataSchemaInterface, UserSchemaInterface } from './interfaces/user.interface';

class Server {
    private app: express.Application;
    private routes!: Routes;
    private config: EnvConfigService;
    private db: Database;

    constructor() {
        this.config = new EnvConfigService();
        this.db = database;
        this.app = express();
    }

    public async start() {
        await this.connectDatabase();
        this.configureApp();
        this.configureRoutes();
        this.startListening();
    }

    private async connectDatabase() {
        return new Promise((resolve) => {
            this.db.database.subscribe((db) => {
                const UsersModel = db.model('users') as Model<UserSchemaInterface>;
                const DataModel = db.model('data') as Model<DataSchemaInterface>;
                this.routes = new Routes(
                    new UserController(UsersModel),
                    new DataController(DataModel),
                    new AuthMiddleware(this.config),
                );
                resolve(true);
            });
        });
    }

    private configureApp() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    private configureRoutes() {
        this.app.use('/', this.routes.default);
        this.app.use('/auth', this.routes.auth);
    }

    private startListening() {
        this.app.listen(this.config.Port, () => {
            // eslint-disable-next-line no-console
            console.log(`Server started at port: ${this.config.Port}`);
        });
    }
}
export default new Server();
