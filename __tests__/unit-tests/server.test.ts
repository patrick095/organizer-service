import EnvConfigService from '../../src/configs/env.config';
import { App } from '../../src/server';

describe('Deve testar a criação da instancia do app', () => {
    test('Deve criar aplicação com configuração de produção', () => {
        const config = new EnvConfigService('production');
        const app = new App(config);
        expect(app).toBeDefined();
    });
});
