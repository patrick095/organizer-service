import { Document } from 'mongoose';

export interface SignInInterface {
    user: string;
    password: string;
}

export interface UserSchemaInterface extends Document {
    name: string;
    user: string;
    password: string;
    email: string;
    sessions: Array<string>;
    theme:{
        bgColor: string;
        fontColor: string;
    }
}
