import 'jest';
import * as express from 'express';
import request from 'supertest';
import IntegrationHelpers from '../helpers/integration-helpers';

describe('Testando as funcionalidades de usuário', () => {
    let app: express.Application;
    let token: string;

    beforeAll(async () => {
        app = await IntegrationHelpers.getApp();
    });

    afterAll(async () => {
        const server = IntegrationHelpers.getServer();
        server.close();
    });

    it('Deve criar um usuário', async () => {
        const user = {
            name: 'Teste',
            user: 'teste',
            email: 'teste@test.com',
            password: 'Teste123',
        };
        const response = await request(app).post('/cadastrar').send(user);
        token = response.body.token;
        expect(response.status).toBe(200);
        expect(response.body.user.name).toBe(user.name);
        expect(response.body.user.user).toBe(user.user);
        expect(response.body.user.email).toBe(user.email);
        expect(response.body.token.length).toBeGreaterThan(0);
    });

    it('Deve tentar criar um usuário com email inválido', async () => {
        const user = {
            name: 'Teste',
            user: 'teste',
            email: 'teste',
            password: 'Teste123',
        };
        const response = await request(app).post('/cadastrar').send(user);
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('invalid email');
    });

    it('Deve tentar criar um usuário com senha menor que 8 caracteres', async () => {
        const user = {
            name: 'Teste',
            user: 'teste',
            email: 'teste@test.com',
            password: 'Teste',
        };
        const response = await request(app).post('/cadastrar').send(user);
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('password must be at least 8 characters long');
    });

    it('Deve tentar criar um usuário com usuário já existente', async () => {
        const user = {
            name: 'Teste',
            user: 'teste',
            email: 'teste@teste2.com',
            password: 'Teste123',
        };
        const response = await request(app).post('/cadastrar').send(user);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('user already in use');
    });

    it('Deve tentar criar um usuário com email já existente', async () => {
        const user = {
            name: 'Teste',
            user: 'teste2',
            email: 'teste@test.com',
            password: 'Teste123',
        };
        const response = await request(app).post('/cadastrar').send(user);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('email already in use');
    });

    it('Deve logar com o usuário criado', async () => {
        const user = {
            user: 'teste',
            password: 'Teste123',
        };
        const response = await request(app).post('/login').send(user);
        expect(response.status).toBe(200);
        expect(response.body.user.name).toBe('Teste');
        expect(response.body.user.user).toBe('teste');
        expect(response.body.user.email).toBe('teste@test.com');
        expect(response.body.token.length).toBeGreaterThan(0);
    });

    it('Deve logar com o email do usuário criado', async () => {
        const user = {
            user: 'teste@test.com',
            password: 'Teste123',
        };
        const response = await request(app).post('/login').send(user);
        expect(response.status).toBe(200);
        expect(response.body.user.name).toBe('Teste');
        expect(response.body.user.user).toBe('teste');
        expect(response.body.user.email).toBe('teste@test.com');
        expect(response.body.token.length).toBeGreaterThan(0);
    });

    it('Deve tentar logar com usuário inválido', async () => {
        const user = {
            user: 'teste2',
            password: 'Teste123',
        };
        const response = await request(app).post('/login').send(user);
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('invalid username or password');
    });

    it('Deve tentar logar com senha inválida', async () => {
        const user = {
            user: 'teste',
            password: 'Teste1234',
        };
        const response = await request(app).post('/login').send(user);
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('invalid username or password');
    });

    it('Deve atualizar o nome e a senha do usuário', async () => {
        const user = {
            name: 'Teste Atualizado',
            user: 'teste',
            password: 'Teste123',
            email: 'teste@test.com',
            newPassword: 'Teste1234',
        };
        const response = await request(app).post('/atualizar').send(user);
        expect(response.status).toBe(200);
        expect(response.body.user.name).toBe(user.name);
        expect(response.body.user.user).toBe(user.user);
        expect(response.body.user.email).toBe(user.email);
    });

    it('Deve logar o usuário com a nova senha', async () => {
        const user = {
            user: 'teste',
            password: 'Teste1234',
        };
        const response = await request(app).post('/login').send(user);
        expect(response.status).toBe(200);
        expect(response.body.user.name).toBe('Teste Atualizado');
        expect(response.body.user.user).toBe('teste');
        expect(response.body.token.length).toBeGreaterThan(0);
    });

    it('Deve validar se o usuário já existe com usuário existente', async () => {
        const response = await request(app).get('/validar?user=teste');
        expect(response.status).toBe(200);
        expect(response.body.valid).toBe(true);
    });

    it('Deve validar se o usuário já existe com email existente', async () => {
        const response = await request(app).get('/validar?email=teste@test.com');
        expect(response.status).toBe(200);
        expect(response.body.valid).toBe(true);
    });

    it('Deve validar se o usuário já existe com usuário inexistente', async () => {
        const response = await request(app).get('/validar?user=teste2');
        expect(response.status).toBe(200);
        expect(response.body.valid).toBe(false);
    });

    it('Deve validar se o usuário já existe com email inexistente', async () => {
        const response = await request(app).get('/validar?email=teste@teste2.com');
        expect(response.status).toBe(200);
        expect(response.body.valid).toBe(false);
    });

    it('Deve validar se o usuário já existe com nome da variável errada', async () => {
        const response = await request(app).get('/validar?userr=teste2');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('user or email not found');
    });

    it('Deve apagar o usuário criado', async () => {
        const user = {
            user: 'teste',
            password: 'Teste1234',
        };
        const response = await request(app).post('/deletar-usuario').send(user);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User deleted');
    });

    it('Deve tentar apagar o usuário já deletado ou inválido', async () => {
        const user = {
            user: 'teste',
            password: 'Teste1234',
        };
        const response = await request(app).post('/deletar-usuario').send(user);
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('invalid username, email or password');
    });

    it('Deve testar as rotas que imprimem "unaltorized"', async () => {
        const response = await request(app).get('/');
        expect(response.text).toBe('unalthorized');

        const response2 = await request(app)
            .get('/auth/')
            .set({ Authorization: `Bearer ${token}` });
        expect(response2.text).toBe('unalthorized');
    });
});
