/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import {
  type ClubLayoutState,
  type ClubLayoutActions,
  type SeatInfo,
  type ReservationFormData,
  type SeatStatus,
} from "@/types";
import { toast } from "sonner";

const api = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001/api";

export const useClubStore = create<ClubLayoutState & ClubLayoutActions>(
  (set, get) => ({
    seatStatuses: {},
    reservations: [],
    selectedSeat: null,
    isModalOpen: false,
    isLoading: false,

    getSeatStatus: (seatId: string): SeatStatus => {
      const { seatStatuses } = get();
      return seatStatuses[seatId] || "available";
    },

    getReservations: (request: any, date: string) => {
      const loading = toast.loading("Cargando reservas...", {
        description: "Por favor espera mientras se cargan las reservas",
      });

      request(`${api}/reservations?date=${date}`, {
        method: "GET",
      }).then((response: any[]) => {
        if (response?.length > 0) {
          // Actualizar estado de asientos reservados
          const reservedStatuses: Record<string, SeatStatus> = {};
          response.forEach((reservation) => {
            // Usar el id del asiento como clave, si tienes un mapping diferente ajústalo aquí
            // Asumimos que 'stage' + '-' + 'seat' es el id, si no, usa solo seat si es único
            // Ejemplo: 'vip-top-4'
            const seatId = `${reservation.stage}-${reservation.seat}`;
            reservedStatuses[seatId] = "reserved";
          });

          set((state) => ({
            reservations: response,
            seatStatuses: { ...state.seatStatuses, ...reservedStatuses },
          }));
          toast.success("Reservaciones actualizadas", {
            description: '',
            id: loading,
          });
        } else {
          toast.info("No se encontraron reservaciones para esta fecha", {
            description: "Puedes elegir cualquier asiento",
            id: loading,
          });
          set({ seatStatuses: {} });
        }
      });
    },

    selectSeat: (seatInfo: SeatInfo) => {
      const currentStatus = get().getSeatStatus(seatInfo.id);
      if (currentStatus === "reserved") return;

      const { seatStatuses } = get();

      // Resetear cualquier asiento previamente seleccionado
      const updatedStatuses = { ...seatStatuses };
      Object.keys(updatedStatuses).forEach((id) => {
        if (updatedStatuses[id] === "selected") {
          updatedStatuses[id] = "available";
        }
      });

      // Seleccionar el nuevo asiento
      updatedStatuses[seatInfo.id] = "selected";

      set({
        seatStatuses: updatedStatuses,
        selectedSeat: seatInfo,
        isModalOpen: true,
      });
    },

    reserveSeat: async (request: any, formData: ReservationFormData) => {
      const { selectedSeat, seatStatuses } = get();
      if (!selectedSeat) return;

      set({ isLoading: true });

      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const todayStr = `${yyyy}-${mm}-${dd}`;
      try {
        const reservation = {
          seat: selectedSeat.seatNumber,
          stage: selectedSeat.section,
          customerFullName: formData.fullName,
          customerPhoneNumber: formData.phoneNumber,
          reservationDate: todayStr,
        };

        // Llamada al API
        request(`${api}/reservations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reservation),
        }).then((response: any) => {
          if (response?.id) {
            toast.success("¡Reserva realizada exitosamente!", {
              description: `Asiento ${selectedSeat?.seatNumber} en ${selectedSeat?.section} reservado para ${formData.fullName}`,
            });
            return;
          }

          toast.error("Error al realizar la reserva", {
            description: "Por favor intenta nuevamente",
          });
        });

        // if (!response.ok) {
        //   throw new Error("Error al realizar la reserva");
        // }

        // Actualizar estado local
        const updatedStatuses = { ...seatStatuses };
        updatedStatuses[selectedSeat.id] = "reserved";

        set({
          seatStatuses: updatedStatuses,
          reservations: [...get().reservations, reservation],
          selectedSeat: null,
          isModalOpen: false,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error:", error);
        set({ isLoading: false });
        throw error;
      }
    },

    closeModal: () => {
      const { seatStatuses, selectedSeat } = get();

      // Resetear asiento seleccionado a disponible
      if (selectedSeat) {
        const updatedStatuses = { ...seatStatuses };
        if (updatedStatuses[selectedSeat.id] === "selected") {
          updatedStatuses[selectedSeat.id] = "available";
        }

        set({
          seatStatuses: updatedStatuses,
          selectedSeat: null,
          isModalOpen: false,
        });
      } else {
        set({
          selectedSeat: null,
          isModalOpen: false,
        });
      }
    },

    updateSeatStatus: (seatId: string, status: SeatStatus) => {
      const { seatStatuses } = get();
      const updatedStatuses = { ...seatStatuses };
      updatedStatuses[seatId] = status;
      set({ seatStatuses: updatedStatuses });
    },
  })
);
