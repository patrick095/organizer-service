import EnvConfigService from '../../src/configs/env.config';
import { emailRegexp } from '../../src/configs/regex.config';
import { newEmptyCard, newEmptyCalendar } from '../../src/configs/newObjects';

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

    test('Deve testar a criação de novos objetos padrões', () => {
        const card = newEmptyCard('1');
        const calendar = newEmptyCalendar('1');

        expect(card.title).toBe('Novo Card');
        expect(card.type).toBe('card');
        expect(card.description).toBe('Descrição do novo card');
        expect(card.date).toBeInstanceOf(Date);
        expect(card.position).toEqual({ x: 0, y: 0 });
        expect(card.theme).toBe('default');
        expect(card.userId).toBe('1');

        expect(calendar.title).toBe('Novo Calendário');
        expect(calendar.type).toBe('calendar');
        expect(calendar.description).toBe('Descrição do novo calendário');
        expect(calendar.date).toBeInstanceOf(Date);
        expect(calendar.position).toEqual({ x: 0, y: 0 });
        expect(calendar.theme).toBe('default');
        expect(calendar.userId).toBe('1');
    });
});
