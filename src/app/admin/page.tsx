"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/hooks/auth";
import { useApiClient } from "@/lib/hooks/authClient";
import { useAdminStore } from "@/store/adminStore";
import { AdminReservations } from "@/components/admin/AdminReservations";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { session, status } = useAuth();
  const { request } = useApiClient();
  const router = useRouter();

  const {
    reservations,
    users,
    isLoading,
    selectedDate,
    getReservations,
    getUsers,
    // setSelectedDate,
  } = useAdminStore();

  console.log('Yo',session)
  // Redirect si no está autenticado
  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !session) {
      router.push("/");
      return;
    }
  }, [status, session, router]);

  // Cargar datos iniciales
  useEffect(() => {
    if (session && status === "authenticated") {
      getReservations(request);
      getUsers(request);
    }
  }, [session, status, getReservations, getUsers]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto" />
          <p className="mt-4 text-lg">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return null; // El useEffect ya maneja la redirección
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard de Administración
              </h1>
              <p className="text-gray-600 mt-2">
                Bienvenido, {session.user?.name || "Admin"}
              </p>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => router.push("/")} variant="outline">
                Volver al Club
              </Button>
              <Button
                onClick={() => {
                  getReservations(request);
                  getUsers(request);
                }}
                disabled={isLoading}
              >
                {isLoading ? "Actualizando..." : "Actualizar Datos"}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Total Reservaciones
            </h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {reservations.length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Para {selectedDate}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Total Usuarios
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {users.length}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Registrados en el sistema
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Usuarios Activos
            </h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {users.filter((u) => u.status === 1).length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Con status activo</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reservaciones */}
          <div className="bg-white rounded-lg shadow">
            <AdminReservations />
          </div>

          {/* Usuarios */}
          <div className="bg-white rounded-lg shadow">
            <AdminUsers />
          </div>
        </div>
      </div>
    </div>
  );
}
