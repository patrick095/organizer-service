import * as express from 'express';
import EnvConfigService from '../../src/configs/env.config';
import { Server } from '../../src/server';

export default class IntegrationHelpers {
    public static appInstance: express.Application;
    public static config: EnvConfigService = new EnvConfigService('test');
    public static async getApp(): Promise<express.Application> {
        if (this.appInstance) {
            return this.appInstance;
        }
        const app = new Server(this.config);
        this.appInstance = await app.start();
        return this.appInstance;
    }
}
