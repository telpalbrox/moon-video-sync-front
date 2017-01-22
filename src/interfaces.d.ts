interface User {
    id?: number;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
}

interface Room {
    id?: number;
    name?: number;
    users?: User[];
}
