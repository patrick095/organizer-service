import mongoose from 'mongoose';
import { Observable } from 'rxjs';

import EnvConfigService from '@configs/env.config';
import { DataModel } from '@models/data';
import { UserModel } from '@models/users';

export class MongoDB {
    private connection: Observable<typeof import('mongoose')>;
    private DataModel: DataModel = new DataModel();
    private UserModel: UserModel = new UserModel();

    constructor(private config: EnvConfigService) {}

    public getInstance(): Observable<typeof import('mongoose')> {
        if (!this.connection) {
            this.connection = new Observable((observer) => {
                mongoose.connect(this.config.MongoUri).then((db) => {
                    db.model('users', this.UserModel.register());
                    db.model('data', this.DataModel.register());
                    observer.next(db);
                    observer.complete();
                });
            });
        }
        return this.connection;
    }
}
