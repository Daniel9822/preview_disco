/* eslint-disable @typescript-eslint/no-explicit-any */
export type SectionType =
  | "vip-left"
  | "vip-top"
  | "vip-right"
  | "general"
  | "bar"
  | "dj"
  | "entrance";

export type SeatStatus = "available" | "reserved" | "selected";

export interface SeatInfo {
  id: string;
  seatNumber: string;
  section: SectionType;
}

export interface Reservation {
  seat: string;
  stage: SectionType;
  customerFullName: string;
  customerPhoneNumber: string;
  reservationDate: string;
  creator?: Creator;
}

export interface ReservationFormData {
  fullName: string;
  phoneNumber: string;
  
}

interface Creator {
  name: string;
  lastName: string;
}

export interface ClubLayoutState {
  seatStatuses: Record<string, SeatStatus>;
  reservations: Reservation[];
  selectedSeat: SeatInfo | null;
  isModalOpen: boolean;
  isLoading: boolean;
}

export interface ClubLayoutActions {
  selectSeat: (seatInfo: SeatInfo) => void;
  reserveSeat: (request: any, formData: ReservationFormData) => Promise<void>;
  getReservations: (request: any, date: string) => void;
  closeModal: () => void;
  updateSeatStatus: (seatId: string, status: SeatStatus) => void;
  getSeatStatus: (seatId: string) => SeatStatus;
}
