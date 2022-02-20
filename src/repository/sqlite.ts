import { Observable } from 'rxjs';

import EnvConfigService from '@configs/env.config';
import { Connection, createConnection } from 'typeorm';

export class SQLiteDB {
    private connection: Observable<Connection>;

    constructor(private config: EnvConfigService) {}

    public getInstance(): Observable<Connection> {
        if (!this.connection) {
            this.connection = new Observable((observer) => {
                createConnection({
                    type: 'sqlite',
                    entities: [`${__dirname}/../entity/*.{ts,js}`],
                    database: './__tests__/db.sqlite',
                    migrations: [`${__dirname}/../migration/*.{ts,js}`],
                    synchronize: true,
                }).then(async (connection) => {
                    // eslint-disable-next-line no-console
                    console.log('SQLite connected');
                    observer.next(connection);
                    observer.complete();
                });
            });
        }
        return this.connection;
    }
}
