import 'jest';
import * as express from 'express';
import request from 'supertest';

import IntegrationHelpers from '../helpers/integration-helpers';
import { ObjectInterface } from '../../src/interfaces/objects.interface';

describe('Testando as funcionalidades dos objetos', () => {
    let app: express.Application;
    let token: string;
    let object: ObjectInterface;

    beforeAll(async () => {
        app = await IntegrationHelpers.getApp();
        const user = {
            name: 'Teste',
            user: 'teste',
            email: 'teste@test.com',
            password: 'Teste123',
        };
        return request(app)
            .post('/cadastrar')
            .send(user)
            .then((response) => {
                token = response.body.token;
            });
    });

    afterAll(async () => {
        const user = {
            user: 'teste',
            password: 'Teste123',
        };
        await request(app).post('/deletar-usuario').send(user);
        const server = IntegrationHelpers.getServer();
        server.close();
    });

    it('deve obter os objetos padrões ao listar a primeira vez', async () => {
        const response = await request(app).post('/auth/get-objects').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.objects.length).toBe(2);
        object = response.body.objects[0];
        expect(response.body.objects[0].title).toBe('Novo Card');
        expect(response.body.objects[0].description).toBe('Descrição do novo card');
        expect(response.body.objects[0].type).toBe('card');
        expect(response.body.objects[1].title).toBe('Novo Calendário');
        expect(response.body.objects[1].description).toBe('Descrição do novo calendário');
        expect(response.body.objects[1].type).toBe('calendar');
    });

    it('deve atualizar um objeto', async () => {
        const changedObject = { ...object, position: { x: 10, y: 10 } };
        const response = await request(app)
            .post('/auth/update-object')
            .set('Authorization', `Bearer ${token}`)
            .send({ object: changedObject });
        object = response.body.object;
        expect(response.status).toBe(200);
        expect(response.body.object.title).toBe('Novo Card');
        expect(response.body.object.description).toBe('Descrição do novo card');
        expect(response.body.object.type).toBe('card');
        expect(response.body.object.position).toEqual({ x: 10, y: 10 });
        expect(response.body.object.theme).toBe('default');
    });

    it('deve criar um novo objeto', async () => {
        const newObject = {
            title: 'Novo Card',
            description: 'Descrição do novo card',
            type: 'card',
            date: new Date(),
            theme: 'default',
            position: { x: 10, y: 10 },
        };
        const response = await request(app)
            .post('/auth/create-object')
            .set('Authorization', `Bearer ${token}`)
            .send({ object: newObject });
        expect(response.status).toBe(200);
        expect(response.body.object.title).toBe('Novo Card');
        expect(response.body.object.description).toBe('Descrição do novo card');
        expect(response.body.object.type).toBe('card');
        expect(response.body.object.position).toEqual({ x: 10, y: 10 });
        expect(response.body.object.theme).toBe('default');
    });

    it('deve deletar um objeto', async () => {
        const response = await request(app)
            .post('/auth/delete-object')
            .set('Authorization', `Bearer ${token}`)
            .send({ object });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Object deleted');
    });
});
