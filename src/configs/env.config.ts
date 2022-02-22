import dotenv from 'dotenv';

dotenv.config();

export default class EnvConfigService {
    constructor(private env: string) {}

    public get Secret(): string {
        return (process.env.SECRET || 'secret').toString();
    }

    public get MongoUri(): string {
        return (process.env.TYPEORM_URL || 'mongodb://localhost:27017/test').toString();
    }

    public get MongoDBName(): string {
        return (process.env.DB_NAME || 'Organizer').toString();
    }

    public get Port(): number {
        return Number(process.env.PORT) || 3000;
    }

    public get bcryptSalt(): number {
        return Number(process.env.BCRYPT_SALT) || 10;
    }

    public get CorsOrigin(): string {
        return (process.env.CORS_ORIGIN || '*').toString();
    }

    public get isProduction(): boolean {
        return this.env === 'production';
    }
}
