/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import {
  type ClubLayoutState,
  type ClubLayoutActions,
  type SeatInfo,
  type ReservationFormData,
  type SeatStatus,
} from "@/types";

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

    selectSeat: (seatInfo: SeatInfo) => {
      const currentStatus = get().getSeatStatus(seatInfo.id);
      if (currentStatus === "reserved") return;

      const { seatStatuses } = get();

      // Resetear cualquier asiento previamente seleccionado
      const updatedStatuses = { ...seatStatuses };
      Object.keys(updatedStatuses).forEach(id => {
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

    reserveSeat: async (formData: ReservationFormData) => {
      const { selectedSeat, seatStatuses } = get();
      if (!selectedSeat) return;

      set({ isLoading: true });

      try {
        const reservation = {
          seat: selectedSeat.seatNumber,
          stage: selectedSeat.section,
          customerFullName: formData.fullName,
          customerPhoneNumber: formData.phoneNumber,
          date: new Date(),
        };

        // Llamada al API
        const response = await fetch("/api/reservations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reservation),
        });

        if (!response.ok) {
          throw new Error("Error al realizar la reserva");
        }

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
