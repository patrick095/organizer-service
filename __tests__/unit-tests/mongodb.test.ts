import { MongoDB } from '../../src/repository/mongoDB';
import EnvConfigService from '../../src/configs/env.config';
import { Connection } from 'typeorm';

describe('Deve testar a criação de um banco de dados SQLite', () => {
    test('Deve testar a criação do banco de dados SQLite', async () => {
        await new Promise((resolve) => {
            const db = new MongoDB(new EnvConfigService('production'));
            db.getInstance().subscribe((connection: Connection) => {
                expect(connection).toBeInstanceOf(Connection);
                connection.close();
                resolve(true);
            });
        });
    });
});
