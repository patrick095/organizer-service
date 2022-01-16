import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { initialDefaultObjects } from 'src/configs/default-objects.config';
import { EnvConfigService } from 'src/configs/env.config';
import { DataSchemaInterface } from 'src/interfaces/user.interface';
import { DataModel } from 'src/models/data';

export class DataController {
    public Data!: Model<DataSchemaInterface>;

    constructor(private dataModel: DataModel, private config: EnvConfigService) {
        this.getDataModel();
    }

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
            objects: initialDefaultObjects,
        };
        const newData = await this.Data.create(data);
        return newData;
    }

    private async getDataModel(): Promise<void> {
        this.Data = await this.dataModel.register();
    }
}
