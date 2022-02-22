import { MongoDB } from '../../src/repository/mongoDB';
import EnvConfigService from '../../src/configs/env.config';
import { Connection } from 'typeorm';

describe('Deve testar a conexão com banco de dados mongoDB fornecido no env', () => {
    test('Deve testar a conexão com banco de dados mongoDB fornecido no env', async () => {
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
