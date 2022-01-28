import { Document } from 'mongoose';

export interface SignInInterface {
    user: string;
    password: string;
}

export interface UpdateUserInterface {
    name: string;
    user: string;
    email: string;
    password: string;
    newPassword: string;
}

export interface UserSchemaInterface extends Document {
    name: string;
    user: string;
    password?: string;
    email: string;
    sessions?: Array<string>;
    theme?: {
        bgColor: string;
        fontColor: string;
    };
}

export interface DataSchemaInterface extends Document {
    userId: string;
    objects: Array<DataObject>;
}

export interface DataObject {
    id: string;
    title: string;
    description: string;
    type: string;
    date: Date;
    theme: string;
    position: {
        x: number;
        y: number;
    };
    width?: number;
    height?: number;
}
