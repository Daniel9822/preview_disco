/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AdminReservation {
  id: number;
  seat: string;
  stage: string;
  customerFullName: string;
  customerPhoneNumber: string;
  reservationDate: string;
  createdAt: string;
  updatedAt: string;
  creator?: {
    name: string;
    lastName: string;
  };
}

export interface AdminUser {
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

export interface AdminDashboardState {
  reservations: AdminReservation[];
  users: AdminUser[];
  isLoading: boolean;
  selectedDate: string;
}

export interface AdminDashboardActions {
  getReservations: (request: any, date?: string) => Promise<void>;
  deleteReservation: (request: any, id: number) => Promise<void>;
  getUsers: (request: any) => Promise<void>;
  deleteUser: (request: any, id: number) => Promise<void>;
  banUser: (request: any, id: number) => Promise<void>;
  setSelectedDate: (date: string) => void;
  setLoading: (loading: boolean) => void;
}
