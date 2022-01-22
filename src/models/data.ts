import { Schema } from 'mongoose';
import { DataSchemaInterface } from '@interfaces/user.interface';

export class DataModel {
    public register(): Schema<DataSchemaInterface> {
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
        return DataSchema;
    }
}
