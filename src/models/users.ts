import { Model, Schema } from 'mongoose';
import { MongoDB } from 'src/database/mongo-db.database';
import { UserSchemaInterface } from '../interfaces/user.interface';

export class UserModel extends MongoDB {
    public register(): Promise<Model<UserSchemaInterface>> {
        const UserSchema = new Schema<UserSchemaInterface>({
            name: {
                type: String,
                required: true,
            },
            user: {
                type: String,
                required: true,
            },
            password: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            sessions: {
                type: [String],
                default: [],
            },
            theme: {
                type: Object,
                default: {
                    bgColor: '#4266b9',
                    fontColor: '#fff',
                },
            },
        });
        return this.connect().then((db) => db.model<UserSchemaInterface>('users', UserSchema));
    }
}
