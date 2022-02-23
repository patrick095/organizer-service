import { Objects } from '../../src/entity/objects';
import { Users } from '../../src/entity/users';

describe('Deve testar as entidades do banco de dados', () => {
    test('Deve testar a entidade de Objeto', () => {
        const novoObjeto = new Objects();
        novoObjeto.userId = '5e9f8f8f8f8f8f8f8f8f8f8';
        expect(novoObjeto.userId).toBe('5e9f8f8f8f8f8f8f8f8f8f8');
        expect(novoObjeto.title).toBe('Novo Card');
        expect(novoObjeto.description).toBe('Descrição do novo Card');
        expect(novoObjeto.type).toBe('card');
        expect(novoObjeto.date).toBeInstanceOf(Date);
        expect(novoObjeto.theme).toBe('default');
        expect(novoObjeto.position).toEqual({ x: 0, y: 0 });
    });

    test('Deve testar a entidade de Usuário', () => {
        const novoUsuario = new Users();
        novoUsuario.email = 'teste@teste.com';
        novoUsuario.password = '123456';
        novoUsuario.name = 'Teste';
        novoUsuario._id = '5e9f8f8f8f8f8f8f8f8f8f8';
        novoUsuario.user = 'teste';
        novoUsuario.sessions = ['5e9f8f8f8f8f8f8f8f8f8f8'];
        expect(novoUsuario.email).toBe('teste@teste.com');
        expect(novoUsuario.password).toBe('123456');
        expect(novoUsuario.name).toBe('Teste');
        expect(novoUsuario._id).toBe('5e9f8f8f8f8f8f8f8f8f8f8');
        expect(novoUsuario.user).toBe('teste');
        expect(novoUsuario.sessions).toEqual(['5e9f8f8f8f8f8f8f8f8f8f8']);
        expect(novoUsuario.theme).toEqual({ bgColor: '#4266b9', fontColor: '#fff' });
    });
});
