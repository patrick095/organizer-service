/* eslint-disable @typescript-eslint/indent */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    _id: string;

    @Column()
    name: string;

    @Column()
    user: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column({ nullable: true, type: 'simple-json' })
    sessions: Array<string>;

    @Column({ nullable: true, type: 'simple-json' })
    theme: Object = {
        bgColor: '#4266b9',
        fontColor: '#fff',
    };
}
