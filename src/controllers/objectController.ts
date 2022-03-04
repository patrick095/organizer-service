import { Request, Response } from 'express';
import { Objects } from '@entity/objects';
import { Repository } from 'typeorm';
import { ObjectID } from 'mongodb';
import { ObjectInterface, ObjectsTypeInterface } from '@interfaces/objects.interface';
import { newEmptyCalendar, newEmptyCard } from '@configs/newObjects';

export class ObjectController {
    constructor(private DataRepository: Repository<Objects>) {}

    public async getObjects(req: Request, res: Response) {
        const userId = req.body.userId as string;
        let objects = await this.DataRepository.find({ userId });
        if (!objects.length) {
            objects = [await this.createObject(userId, 'card'), await this.createObject(userId, 'calendar')];
        }
        return res.status(200).json({ objects });
    }

    public async updateObject(req: Request, res: Response) {
        const { userId, object } = req.body as { userId: string; object: ObjectInterface };

        const ObjectDB = (await this.DataRepository.findOne({ _id: new ObjectID(object._id) }))
            ?? (await this.DataRepository.findOne({ _id: object._id }));
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
        await this.DataRepository.update({ _id: ObjectDB._id }, ObjectDB);
        return res.status(200).json({ object: ObjectDB });
    }

    public async createNewObject(req: Request, res: Response) {
        const { userId, object } = req.body as { userId: string; object: ObjectInterface };

        if (object) {
            const newObject = await this.DataRepository.save({ ...object, userId });
            return res.status(200).json({ object: newObject });
        }
        return res.status(400).json({ error: 'invalid object' });
    }

    public async deleteObject(req: Request, res: Response) {
        const { userId, object } = req.body as { userId: string; object: ObjectInterface };

        const ObjectDB = (await this.DataRepository.findOne({ _id: new ObjectID(object._id) }))
            ?? (await this.DataRepository.findOne({ _id: object._id }));

        if (ObjectDB && ObjectDB.userId.toString() !== userId.toString()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!ObjectDB) {
            return res.status(400).json({ error: 'invalid object' });
        }

        await this.DataRepository.delete(ObjectDB._id);
        return res.status(200).json({ message: 'Object deleted' });
    }

    private async createObject(userId: string, type: ObjectsTypeInterface) {
        let newObject: ObjectInterface;
        if (type === 'card') {
            newObject = newEmptyCard(userId);
        } else {
            newObject = newEmptyCalendar(userId);
        }
        const obj = await this.DataRepository.save(newObject);
        return obj;
    }
}
