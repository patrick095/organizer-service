import 'jest';
import * as express from 'express';
import request from 'supertest';
import IntegrationHelpers from '../helpers/integration-helpers';

describe('Testando as validações do middleware', () => {
    let app: express.Application;

    beforeAll(async () => {
        app = await IntegrationHelpers.getApp();
    });

    afterAll(async () => {
        const server = IntegrationHelpers.getServer();
        server.close();
    });

    it('Deve testar o middleware de validação quando não envia token', async () => {
        const response = await request(app).get('/auth/');
        expect(response.status).toBe(401);
        expect(response.body.erro).toBe('token não informado!');
    });

    it('Deve testar o middleware de validação quando o token não tem espaço', async () => {
        const response = await request(app).get('/auth/').set('Authorization', 'Bearer123');
        expect(response.status).toBe(401);
        expect(response.body.erro).toBe('token incompleto!');
    });

    it('Deve testar o middleware de validação quando o token não tem o prefixo Bearer', async () => {
        const response = await request(app).get('/auth/').set('Authorization', 'Errado 123');
        expect(response.status).toBe(401);
        expect(response.body.erro).toBe('token mal formado!');
    });

    it('Deve testar o middleware de validação quando o token é inválido', async () => {
        const response = await request(app).get('/auth/').set('Authorization', 'Bearer 123');
        expect(response.status).toBe(401);
        expect(response.body.erro).toBe('token inválido!');
    });
});
