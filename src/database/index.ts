import { MongoDB } from '@database/mongo-db.database';
import EnvConfigService from '@configs/env.config';
import { Observable } from 'rxjs';
import { DataModel } from '@models/data';
import { UserModel } from '@models/users';

export class Database extends MongoDB {
    public UserModel: UserModel = new UserModel();
    public DataModel: DataModel = new DataModel();
    public database: Observable<typeof import('mongoose')>;

    constructor() {
        super(new EnvConfigService());
        this.database = new Observable((observer) => {
            this.connect().then((db) => {
                db.model('users', this.UserModel.register());
                db.model('data', this.DataModel.register());
                observer.next(db);
                observer.complete();
            });
        });
    }
}
export default new Database();
