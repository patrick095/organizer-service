import express from 'express';
import cors from 'cors';

import EnvConfigService from '@configs/env.config';
import { UserController } from '@controllers/userController';
import { DataController } from '@controllers/dataController';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import Routes from '@routers/routes';
import { MongoDB } from '@repository/mongoDB';
import { Users } from '@entity/users';
import { Objects } from '@entity/data';

class Server {
    private app: express.Application;
    private config: EnvConfigService;
    private db: MongoDB;
    private routes: Routes;

    constructor() {
        this.app = express();
        this.config = new EnvConfigService();
        if (this.config.isProduction) {
            this.db = new MongoDB(this.config);
        }
        // @TODO alterar para TypeOrm ou outro ORM para poder rodar os testes
        // em um banco de dados diferente SQLite (preferência typeorm ou sequelize)
    }

    public async start() {
        await this.connectDatabase();
        this.configureApp();
        this.configureRoutes();
        this.startListening();
    }

    private async connectDatabase() {
        return new Promise((resolve) => {
            this.db.getInstance().subscribe((connection) => {
                const UsersRepository = connection.getRepository(Users);
                const DataRepository = connection.getRepository(Objects);
                this.routes = new Routes(
                    new UserController(UsersRepository),
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
        this.app.listen(this.config.Port, () => {
            // eslint-disable-next-line no-console
            console.log(`Server started at port: ${this.config.Port}`);
        });
    }
}
export default new Server();
