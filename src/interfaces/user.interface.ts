import { ObjectInterface } from './objects.interface';

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

export interface UserSchemaInterface {
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

export interface DataSchemaInterface {
    userId: string;
    objects: Array<ObjectInterface>;
}
