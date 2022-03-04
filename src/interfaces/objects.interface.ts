export interface ObjectInterface {
    _id?: string;
    title: string;
    userId: string;
    description: string;
    type: ObjectsTypeInterface;
    date: Date;
    theme: string;
    position: {
        x: number;
        y: number;
    };
    width?: number;
    height?: number;
}

export type ObjectsTypeInterface = 'card' | 'calendar';
