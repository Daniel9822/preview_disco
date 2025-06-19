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
  reservationDate: Date;
}

export interface ReservationFormData {
  fullName: string;
  phoneNumber: string;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reserveSeat: (request: any, formData: ReservationFormData) => Promise<void>;
  closeModal: () => void;
  updateSeatStatus: (seatId: string, status: SeatStatus) => void;
  getSeatStatus: (seatId: string) => SeatStatus;
}
