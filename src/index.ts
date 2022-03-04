import dotenv from 'dotenv';
import EnvConfigService from '@configs/env.config';
import { App } from './server';

dotenv.config();
const env = process.env.NODE_ENV || 'development';

const config = new EnvConfigService(env.toString());
const app = new App(config);
app.start();
