import EnvConfigService from '../../src/configs/env.config';
import { emailRegexp } from '../../src/configs/regex.config';

describe('Deve testar as configurações do projeto', () => {
    test('Deve retornar os valores de configuração Test', () => {
        const config = new EnvConfigService('test');
        expect(config.Port).toBe(3000);
        expect(config.isProduction).toBe(false);
        expect(config.CorsOrigin).toBe('*');
    });

    test('Deve testar os regex que estão na configuração', () => {
        expect(emailRegexp.test('teste')).toBe(false);
        expect(emailRegexp.test('teste@test.com')).toBe(true);
    });
});
