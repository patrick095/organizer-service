import mongoose from "mongoose";
import { EnvConfigService } from "../configs/env.config";


export class MongoDB {
    private MongoURL: string;
    constructor(private config: EnvConfigService) {
        this.MongoURL = this.config.MongoDBUrl;
    }

    public async connect() {
        mongoose.connect(this.MongoURL).then(() => {
            console.log("MongoDB connected");
        });
        return mongoose;
    }
}