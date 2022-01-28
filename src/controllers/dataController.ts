import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { DataSchemaInterface } from '@interfaces/user.interface';

export class DataController {
    constructor(private Data: Model<DataSchemaInterface>) {}

    public async getData(req: Request, res: Response) {
        const userId = req.body.userId as string;
        let data = await this.Data.findOne({ userId });
        if (!data) {
            data = await this.createData(userId);
        }
        return res.status(200).json(data);
    }

    public async updateData(req: Request, res: Response) {
        const userId = req.body.userId as string;
        const objects = req.body.objects as DataSchemaInterface;

        const data = await this.Data.findOne({ userId });
        if (!data) {
            return res.status(400).json({ error: 'invalid userId' });
        }
        const updatedData = await this.Data.findByIdAndUpdate(data._id, { userId, objects }, { new: true });
        return res.status(200).json(updatedData);
    }

    private async createData(userId: string) {
        const data = {
            userId,
        };
        const newData = await this.Data.create(data);
        return newData;
    }
}
