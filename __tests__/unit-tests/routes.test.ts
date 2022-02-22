import express from 'express';
import Routes from '../../src/routers/routes';
import { UserController } from '../../src/controllers/userController';
import { DataController } from '../../src/controllers/dataController';
import { AuthMiddleware } from '../../src/middlewares/auth.middleware';
import { SQLiteDB } from '../../src/repository/sqlite';
import EnvConfigService from '../../src/configs/env.config';
import { Users } from '../../src/entity/users';
import { Objects } from '../../src/entity/objects';

describe('Deve testar as rotas da aplicação', () => {
    let routes: Routes;

    beforeAll(async () => {
        await new Promise((resolve) => {
            const config = new EnvConfigService('test');
            const db = new SQLiteDB(config);
            db.getInstance().subscribe((connection) => {
                const UsersRepository = connection.getRepository(Users);
                const DataRepository = connection.getRepository(Objects);
                routes = new Routes(
                    new UserController(UsersRepository, config),
                    new DataController(DataRepository),
                    new AuthMiddleware(config),
                );
                connection.close();
                resolve(true);
            });
        });
    });

    test('Deve verificar todas as rotas da aplicação', () => {
        expect(routes.default.stack.length).toBe(6);
        expect(routes.auth.stack.length).toBe(6);
        expect(routes.default.stack[0].route.path).toBe('/');
        expect(routes.default.stack[1].route.path).toBe('/cadastrar');
        expect(routes.default.stack[2].route.path).toBe('/login');
        expect(routes.default.stack[3].route.path).toBe('/atualizar');
        expect(routes.default.stack[4].route.path).toBe('/validar');
        expect(routes.default.stack[5].route.path).toBe('/deletar-usuario');
        expect(routes.auth.stack[1].route.path).toBe('/');
        expect(routes.auth.stack[2].route.path).toBe('/create-object');
        expect(routes.auth.stack[3].route.path).toBe('/get-objects');
        expect(routes.auth.stack[4].route.path).toBe('/update-object');
        expect(routes.auth.stack[5].route.path).toBe('/delete-object');
    });
});
