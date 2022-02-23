import EnvConfigService from '@configs/env.config';
import { App } from './server';

const env = process.env.NODE_ENV || 'development';
const config = new EnvConfigService(env.toString());
const app = new App(config);
app.start();
