export interface ICourse {
    _id?: string;
    desc: string;
    image: string;
    price: number;
    name: string;
    lecturer: string;
    bookings?: string[]
    appointments?: Appointment[]
}

export interface Appointment {
    _id?: string;
    date: Date;
    count: number
}

