/* eslint-disable @typescript-eslint/indent */
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Objects {
    @ObjectIdColumn({ nullable: true, type: 'simple-json' })
    _id: ObjectID | string;

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

    @Column({ nullable: true, type: 'simple-json' })
    position: {
        x: number;
        y: number;
    } = {
        x: 0,
        y: 0,
    };
}
