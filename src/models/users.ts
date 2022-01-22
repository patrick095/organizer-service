import { Schema } from 'mongoose';
import { UserSchemaInterface } from '@interfaces/user.interface';

export class UserModel {
    public register(): Schema<UserSchemaInterface> {
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
        return UserSchema;
    }
}
