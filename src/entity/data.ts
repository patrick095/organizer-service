/* eslint-disable @typescript-eslint/indent */
import { Column, Entity, ObjectID as ObjectIDType, ObjectIdColumn } from 'typeorm';

@Entity()
export class Objects {
    @ObjectIdColumn()
    _id: ObjectIDType;

    @Column()
    userId: string;

    @Column()
    title: string = 'Novo Card';

    @Column()
    description: string = 'Descrição do novo Card';

    @Column()
    type: string = 'card';

    @Column()
    date: Date = new Date();

    @Column()
    theme: string = 'default';

    @Column()
    position: {
        x: number;
        y: number;
    } = {
        x: 0,
        y: 0,
    };

    // @Column({ type: 'jsonb' })
    // objects: Array<DataObject> = [
    //     {
    //         id: '1',
    //         title: 'Novo Card',
    //         description: 'Descrição do card',
    //         type: 'card',
    //         date: new Date(),
    //         theme: 'default',
    //         position: {
    //             x: 0,
    //             y: 0,
    //         },
    //     },
    //     {
    //         id: '2',
    //         title: 'Novo Calendário',
    //         description: 'Descrição do Calendário',
    //         type: 'calendarMonth',
    //         date: new Date(),
    //         theme: 'default',
    //         position: {
    //             x: 0,
    //             y: 0,
    //         },
    //     },
    // ];
}
