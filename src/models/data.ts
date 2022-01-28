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
                default: [
                    {
                        id: '1',
                        title: 'Novo Card',
                        description: 'Descrição do card',
                        type: 'card',
                        date: new Date(),
                        theme: 'default',
                        position: {
                            x: 0,
                            y: 0,
                        },
                    },
                    {
                        id: '2',
                        title: 'Novo Calendário',
                        description: 'Descrição do Calendário',
                        type: 'calendarMonth',
                        date: new Date(),
                        theme: 'default',
                        position: {
                            x: 0,
                            y: 0,
                        },
                    },
                ],
            },
        });
        return DataSchema;
    }
}
