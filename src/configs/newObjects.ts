import { ObjectInterface } from '@interfaces/objects.interface';

export function newEmptyCard(userId: string): ObjectInterface {
    return {
        title: 'Novo Card',
        type: 'card',
        description: 'Descrição do novo card',
        date: new Date(),
        position: {
            x: 0,
            y: 0,
        },
        theme: 'default',
        userId,
    };
}

export function newEmptyCalendar(userId: string): ObjectInterface {
    return {
        title: 'Novo Calendário',
        type: 'calendar',
        description: 'Descrição do novo calendário',
        date: new Date(),
        position: {
            x: 0,
            y: 0,
        },
        theme: 'default',
        userId,
    };
}
