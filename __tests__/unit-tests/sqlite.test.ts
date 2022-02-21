import { SQLiteDB } from '../../src/repository/sqlite';
import EnvConfigService from '../../src/configs/env.config';
import { Connection } from 'typeorm';

describe('Deve testar a criação de um banco de dados SQLite', () => {
    test('Deve testar a criação do banco de dados SQLite', async () => {
        await new Promise((resolve) => {
            const db = new SQLiteDB(new EnvConfigService('test'));
            db.getInstance().subscribe((connection: Connection) => {
                expect(connection).toBeInstanceOf(Connection);
                connection.close();
                resolve(true);
            });
        });
    });
});
