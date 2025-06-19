export interface User {
    id: number;
    name: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    rolId: number | null;
    status: number;
    createdAt: string;
    updatedAt: string;
}