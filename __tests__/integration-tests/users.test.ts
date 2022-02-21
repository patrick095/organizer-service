import 'jest';
import * as express from 'express';
import request from 'supertest';
import IntegrationHelpers from '../helpers/integration-helpers';

describe('Testando as funcionalidades de usuário', () => {
    let app: express.Application;

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
        expect(response.status).toBe(200);
        expect(response.body.user.name).toBe(user.name);
        expect(response.body.user.user).toBe(user.user);
        expect(response.body.user.email).toBe(user.email);
        expect(response.body.token.length).toBeGreaterThan(0);
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

    it('Deve apagar o usuário criado', async () => {
        const user = {
            user: 'teste',
            password: 'Teste1234',
        };
        const response = await request(app).post('/deletar-usuario').send(user);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User deleted');
    });
});
