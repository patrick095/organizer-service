import EnvConfigService from '@configs/env.config';
import { App } from './server';

const config = new EnvConfigService(process.env.NODE_ENV.toString());
const app = new App(config);
app.start();
