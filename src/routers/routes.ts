import { Models } from '@models/*';
import express, { Request, Response } from 'express';
import { EnvConfigService } from 'src/configs/env.config';
import { UserController } from 'src/controllers/userController';

export class Routes {
    private routes: express.Router;
    private userController: UserController;
    constructor(private models: Models, private config: EnvConfigService) {
        this.routes = express.Router();
        this.userController = new UserController(this.models.UserModel, this.config);
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
}
