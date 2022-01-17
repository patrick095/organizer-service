import mongoose from 'mongoose';
import { EnvConfigService } from '../configs/env.config';

export class MongoDB {
    private MongoURL: string;
    constructor(private config: EnvConfigService) {
        this.MongoURL = this.config.MongoDBUrl;
    }

    public async connect() {
        await mongoose.connect(this.MongoURL).then((connection) => {
            // eslint-disable-next-line no-console
            console.log('MongoDB connected');
            return connection;
        });
        return mongoose;
    }
}
