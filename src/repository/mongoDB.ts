import mongoose from 'mongoose';
import { Observable } from 'rxjs';
import { DataModel } from '@models/data';
import { UserModel } from '@models/users';
import EnvConfigService from '@configs/env.config';

export class MongoDB {
    private config: EnvConfigService;
    private database: Observable<typeof import('mongoose')>;
    private DataModel: DataModel = new DataModel();
    private MongoURL: string;
    private UserModel: UserModel = new UserModel();

    constructor() {
        this.config = new EnvConfigService();
        this.MongoURL = this.config.MongoDBUrl;
    }

    public getInstance(): Observable<typeof import('mongoose')> {
        if (!this.database) {
            this.database = new Observable((observer) => {
                this.connect().then((db) => {
                    db.model('users', this.UserModel.register());
                    db.model('data', this.DataModel.register());
                    observer.next(db);
                    observer.complete();
                });
            });
        }
        return this.database;
    }

    private async connect() {
        return mongoose.connect(this.MongoURL);
    }
}
