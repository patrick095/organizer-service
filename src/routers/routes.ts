import { Models } from '@models/*';
import express, { Request, Response } from 'express';
import { UserController } from '../controllers/userController';
import { DataController } from '../controllers/dataController';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { EnvConfigService } from '../configs/env.config';

export class Routes {
    private routes: express.Router;
    private userController: UserController;
    private dataController: DataController;
    private authMiddleware: AuthMiddleware;
    constructor(private models: Models, private config: EnvConfigService) {
        this.routes = express.Router();
        this.userController = new UserController(this.models.UserModel, this.config);
        this.dataController = new DataController(this.models.DataModel, this.config);
        this.authMiddleware = new AuthMiddleware(this.config);
    }

    public get default(): express.Router {
        this.routes.get('/', (req: Request, res: Response) => {
            res.send('unalthorized');
        });
        this.routes.post('/login', this.userController.signin.bind(this.userController));
        this.routes.post('/cadastrar', this.userController.signup.bind(this.userController));
        this.routes.post('/atualizar', this.userController.updateUser.bind(this.userController));

        return this.routes;
    }

    public get auth(): express.Router {
        this.routes.use(this.authMiddleware.autenticate.bind(this.authMiddleware));
        this.routes.get('/', (req: Request, res: Response) => {
            res.send('unalthorized');
        });
        this.routes.post('/get-data', this.dataController.getData.bind(this.dataController));
        this.routes.post('/update-data', this.dataController.updateData.bind(this.dataController));

        return this.routes;
    }
}
