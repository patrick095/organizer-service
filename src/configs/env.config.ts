import dotenv from 'dotenv';

dotenv.config();

export default class EnvConfigService {
    public get Secret(): string {
        return process.env.SECRET.toString();
    }

    public get MongoUri(): string {
        return process.env.MONGODB_URI.toString();
    }

    public get Port(): number {
        return Number(process.env.PORT);
    }

    public get bcryptSalt(): number {
        return Number(process.env.BCRYPT_SALT);
    }

    public get CorsOrigin(): string {
        return process.env.CORS_ORIGIN.toString();
    }

    public get isProduction(): boolean {
        return process.env.NODE_ENV === 'production';
    }
}
