import express, { Request, Response } from 'express';
import { UserController } from '@controllers/userController';
import { DataController } from '@controllers/dataController';
import { AuthMiddleware } from '@middlewares/auth.middleware';

export default class Routes {
    private routes: express.Router;
    private authRoutes: express.Router;
    constructor(
        private userController: UserController,
        private dataController: DataController,
        private authMiddleware: AuthMiddleware,
    ) {
        this.routes = express.Router();
        this.authRoutes = express.Router();
    }

    public get default(): express.Router {
        this.routes.get('/', (req: Request, res: Response) => {
            res.send('unalthorized');
        });
        this.routes.post('/login', this.userController.signin.bind(this.userController));
        this.routes.post('/cadastrar', this.userController.signup.bind(this.userController));
        this.routes.post('/atualizar', this.userController.updateUser.bind(this.userController));
        this.routes.get('/validar', this.userController.validateUser.bind(this.userController));

        return this.routes;
    }

    public get auth(): express.Router {
        this.authRoutes.use(this.authMiddleware.autenticate.bind(this.authMiddleware));
        this.authRoutes.get('/', (req: Request, res: Response) => {
            res.send('unalthorized');
        });
        this.authRoutes.post('/get-data', this.dataController.getData.bind(this.dataController));
        this.authRoutes.post('/update-data', this.dataController.updateData.bind(this.dataController));

        return this.authRoutes;
    }
}
