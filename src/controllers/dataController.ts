import { Request, Response } from 'express';
import { DataSchemaInterface } from '@interfaces/user.interface';
import { Datas } from 'entity/data';
import { Repository } from 'typeorm';

export class DataController {
    constructor(private DataRepository: Repository<Datas>) {}

    public async getData(req: Request, res: Response) {
        const userId = req.body.userId as string;
        let data = await this.DataRepository.findOne({ userId });
        if (!data) {
            data = await this.createData(userId);
        }
        return res.status(200).json(data);
    }

    public async updateData(req: Request, res: Response) {
        const { userId, objects } = req.body as DataSchemaInterface;

        const data = await this.DataRepository.findOne({ userId });

        if (!data) {
            return res.status(400).json({ error: 'invalid userId' });
        }
        data.objects = objects;
        await this.DataRepository.update(data.id, data);
        return res.status(200).json(data);
    }

    private async createData(userId: string) {
        const data = {
            userId,
        };
        const newData = await this.DataRepository.create(data);
        return newData;
    }
}
