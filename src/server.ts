import express from 'express';
import cors from 'cors';

import EnvConfigService from '@configs/env.config';
import { UserController } from '@controllers/userController';
import { DataController } from '@controllers/dataController';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import Routes from '@routers/routes';
import { MongoDB } from '@repository/mongoDB';
import { Users } from '@entity/users';
import { Objects } from '@entity/objects';
import { SQLiteDB } from '@repository/sqlite';
import { Server } from 'http';

export class App {
    private server: Server;
    private app: express.Application;
    private db: MongoDB | SQLiteDB;
    private routes: Routes;

    constructor(private config: EnvConfigService) {
        this.app = express();
        if (this.config.isProduction) {
            this.db = new MongoDB(this.config);
        } else {
            this.db = new SQLiteDB(this.config);
        }
    }

    public async start() {
        await this.connectDatabase();
        this.configureApp();
        this.configureRoutes();
        this.startListening();
        return this.app;
    }

    public getServer() {
        return this.server;
    }

    private async connectDatabase() {
        return new Promise((resolve) => {
            this.db.getInstance().subscribe((connection) => {
                const UsersRepository = connection.getRepository(Users);
                const DataRepository = connection.getRepository(Objects);
                this.routes = new Routes(
                    new UserController(UsersRepository, this.config),
                    new DataController(DataRepository),
                    new AuthMiddleware(this.config),
                );
                resolve(true);
            });
        });
    }

    private configureApp() {
        this.app.use(cors({ origin: this.config.CorsOrigin, methods: ['GET', 'POST'] }));
        this.app.use(express.json());
    }

    private configureRoutes() {
        this.app.use('/', this.routes.default);
        this.app.use('/auth', this.routes.auth);
    }

    private startListening() {
        this.server = this.app.listen(this.config.Port, () => {
            // eslint-disable-next-line no-console
            console.log(`Server started at port: ${this.config.Port}`);
        });
    }
}
