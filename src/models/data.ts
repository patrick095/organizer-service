import { Model, Schema } from 'mongoose';
import { MongoDB } from 'src/database/mongo-db.database';
import { DataSchemaInterface } from '../interfaces/user.interface';

export class DataModel extends MongoDB {
    public register(): Promise<Model<DataSchemaInterface>> {
        const DataSchema = new Schema<DataSchemaInterface>({
            userId: {
                type: String,
                required: true,
            },
            objects: {
                type: [Object],
                default: [],
            },
        });

        return this.connect().then((db) => db.model<DataSchemaInterface>('data', DataSchema));
    }
}
