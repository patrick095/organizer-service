import { Request, Response } from 'express';
import { DataObject } from '@interfaces/user.interface';
import { Objects } from 'entity/data';
import { Repository } from 'typeorm';
import { ObjectID } from 'mongodb';

export class DataController {
    constructor(private DataRepository: Repository<Objects>) {}

    public async getObjects(req: Request, res: Response) {
        const userId = req.body.userId as string;
        let objects = await this.DataRepository.find({ userId });
        if (!objects.length) {
            objects = [await this.createObject(userId)];
        }
        return res.status(200).json({ objects });
    }

    public async updateObject(req: Request, res: Response) {
        const { userId, object } = req.body as { userId: string; object: DataObject };

        const ObjectDB = await this.DataRepository.findOne({ _id: new ObjectID(object._id) });
        if (ObjectDB.userId !== userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!ObjectDB) {
            return res.status(400).json({ error: 'invalid object' });
        }

        ObjectDB.date = object.date;
        ObjectDB.description = object.description;
        ObjectDB.title = object.title;
        ObjectDB.position = object.position;
        ObjectDB.theme = object.theme;
        await this.DataRepository.update(ObjectDB._id, ObjectDB);
        return res.status(200).json(ObjectDB);
    }

    public async createNewObject(req: Request, res: Response) {
        const { userId, object } = req.body as { userId: string; object: DataObject };

        const newObject = await this.DataRepository.save({ ...object, userId });
        return res.status(200).json(newObject);
    }

    public async deleteObject(req: Request, res: Response) {
        const { userId, objectId } = req.body as { userId: string; objectId: string };

        const ObjectDB = await this.DataRepository.findOne({ _id: new ObjectID(objectId) });

        if (ObjectDB.userId !== userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!ObjectDB) {
            return res.status(400).json({ error: 'invalid object' });
        }

        await this.DataRepository.delete(ObjectDB._id);
        return res.status(200).json({ message: 'Object deleted' });
    }

    private async createObject(userId: string) {
        const object = {
            userId,
        };
        const newObject = await this.DataRepository.save(object);
        return newObject;
    }
}
