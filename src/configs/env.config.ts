import dotenv from 'dotenv';

dotenv.config();

export class EnvConfigService {
    public get Secret(): string {
        return process.env.SECRET as string;
    }

    public get MongoDBUrl(): string {
        return process.env.MONGODB_URL as string;
    }

    public get Port(): number {
        return Number(process.env.PORT);
    }
}
