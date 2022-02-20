import * as express from 'express';
import { Server } from 'http';
import EnvConfigService from '../../src/configs/env.config';
import { App } from '../../src/server';

export default class IntegrationHelpers {
    public static appInstance: express.Application;
    public static config: EnvConfigService = new EnvConfigService('test');
    private static app: App;
    public static async getApp(): Promise<express.Application> {
        if (this.appInstance) {
            return this.appInstance;
        }
        this.app = new App(this.config);
        this.appInstance = await this.app.start();
        return this.appInstance;
    }

    public static getServer(): Server {
        return this.app.getServer();
    }
}
