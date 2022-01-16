import express from 'express';
import cors from 'cors';
import { Routes } from './routers/routes';
import { EnvConfigService } from './configs/env.config';
import { Models } from './models';

export class App {
    private app: express.Application;
    private routes: Routes;
    private config: EnvConfigService;
    private models: Models;
    constructor() {
        this.config = new EnvConfigService();
        this.models = new Models();
        this.app = express();
        this.routes = new Routes(this.models, this.config);
    }
    
    public async start() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use('/', this.routes.default);
        this.app.listen(this.config.Port, () => {
            console.log('Server started at port: ' + this.config.Port);
        });
    }
}