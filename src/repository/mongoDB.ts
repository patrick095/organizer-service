import { Observable } from 'rxjs';

import EnvConfigService from '@configs/env.config';
import { Connection, createConnection } from 'typeorm';

export class MongoDB {
    private connection: Observable<Connection>;

    constructor(private config: EnvConfigService) {}

    public getInstance(): Observable<Connection> {
        if (!this.connection) {
            this.connection = new Observable((observer) => {
                createConnection({
                    type: 'mongodb',
                    url: this.config.MongoUri,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    entities: [`${__dirname}/../entity/*.{ts,js}`],
                    database: this.config.MongoDBName,
                }).then(async (connection) => {
                    // eslint-disable-next-line no-console
                    console.log('MongoDB connected');
                    observer.next(connection);
                    observer.complete();
                });
            });
        }
        return this.connection;
    }
}
