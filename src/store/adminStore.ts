/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { toast } from "sonner";
import type {
  AdminDashboardState,
  AdminDashboardActions,
  AdminReservation,
  AdminUser,
} from "@/types/admin";

const api = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

export const useAdminStore = create<AdminDashboardState & AdminDashboardActions>(
  (set, get) => ({
    reservations: [],
    users: [],
    isLoading: false,
    selectedDate: new Date().toISOString().split('T')[0], // formato yyyy-mm-dd

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setSelectedDate: (date: string) => {
      set({ selectedDate: date });
    },

    getReservations: async (request: any, date?: string) => {
      const { selectedDate } = get();
      const filterDate = date || selectedDate;

      set({ isLoading: true });
      const loading = toast.loading("Cargando reservaciones...", {
        description: "Por favor espera mientras se cargan las reservaciones",
      });

      try {
        const url = filterDate
          ? `${api}/reservations?date=${filterDate}`
          : `${api}/reservations`;

        const response: AdminReservation[] = await request(url, {
          method: "GET",
        });

        set({ reservations: response, isLoading: false });
        toast.success("Reservaciones cargadas correctamente", {
          id: loading,
        });
      } catch (error) {
        console.error("Error al cargar reservaciones:", error);
        toast.error("Error al cargar reservaciones", {
          description: "No se pudieron cargar las reservaciones",
          id: loading,
        });
        set({ isLoading: false });
      }
    },

    deleteReservation: async (request: any, id: number) => {
      const loading = toast.loading("Eliminando reservación...", {
        description: "Por favor espera mientras se elimina la reservación",
      });

      try {
        await request(`${api}/reservations/${id}`, {
          method: "DELETE",
        });

        // Actualizar estado local removiendo la reservación eliminada
        const { reservations } = get();
        const updatedReservations = reservations.filter(r => r.id !== id);
        set({ reservations: updatedReservations });

        toast.success("Reservación eliminada correctamente", {
          id: loading,
        });
      } catch (error) {
        console.error("Error al eliminar reservación:", error);
        toast.error("Error al eliminar reservación", {
          description: "No se pudo eliminar la reservación",
          id: loading,
        });
      }
    },

    getUsers: async (request: any) => {
      set({ isLoading: true });
      const loading = toast.loading("Cargando usuarios...", {
        description: "Por favor espera mientras se cargan los usuarios",
      });

      try {
        const response: AdminUser[] = await request(`${api}/auth/users`, {
          method: "GET",
        });

        set({ users: response, isLoading: false });
        toast.success("Usuarios cargados correctamente", {
          id: loading,
        });
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        toast.error("Error al cargar usuarios", {
          description: "No se pudieron cargar los usuarios",
          id: loading,
        });
        set({ isLoading: false });
      }
    },

    deleteUser: async (request: any, id: number) => {
      const loading = toast.loading("Eliminando usuario...", {
        description: "Por favor espera mientras se elimina el usuario",
      });

      try {
        await request(`${api}/auth/users/${id}`, {
          method: "DELETE",
        });

        // Actualizar estado local removiendo el usuario eliminado
        const { users } = get();
        const updatedUsers = users.filter(u => u.id !== id);
        set({ users: updatedUsers });

        toast.success("Usuario eliminado correctamente", {
          id: loading,
        });
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        toast.error("Error al eliminar usuario", {
          description: "No se pudo eliminar el usuario",
          id: loading,
        });
      }
    },

    banUser: async (request: any, id: number) => {
      const loading = toast.loading("Baneando usuario...", {
        description: "Por favor espera mientras se banea el usuario",
      });

      try {
        await request(`${api}/auth/users/${id}/ban`, {
          method: "POST",
        });

        // Actualizar estado local - podrías actualizar el status del usuario
        const { users } = get();
        const updatedUsers = users.map(u =>
          u.id === id ? { ...u, status: 0 } : u // Asumiendo que 0 = baneado
        );
        set({ users: updatedUsers });

        toast.success("Usuario baneado correctamente", {
          id: loading,
        });
      } catch (error) {
        console.error("Error al banear usuario:", error);
        toast.error("Error al banear usuario", {
          description: "No se pudo banear el usuario",
          id: loading,
        });
      }
    },
  })
);
