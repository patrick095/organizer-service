/* eslint-disable @typescript-eslint/indent */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Datas {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @Column()
    objects: Object[] = [
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
    ];
}
