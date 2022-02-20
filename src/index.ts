import EnvConfigService from '@configs/env.config';
import { Server } from './server';

const config = new EnvConfigService(process.env.NODE_ENV.toString());
const app = new Server(config);
app.start();
