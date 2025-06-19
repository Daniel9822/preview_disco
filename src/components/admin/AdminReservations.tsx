"use client";

import { useState } from "react";
import { useApiClient } from "@/lib/hooks/authClient";
import { useAdminStore } from "@/store/adminStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
//   DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Search, Calendar } from "lucide-react";
// import { toast } from "sonner";

export function AdminReservations() {
  const { request } = useApiClient();
  const {
    reservations,
    isLoading,
    selectedDate,
    setSelectedDate,
    getReservations,
    deleteReservation,
  } = useAdminStore();

  const [filterDate, setFilterDate] = useState(selectedDate);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<number | null>(
    null
  );

  const handleDateFilter = () => {
    setSelectedDate(filterDate);
    getReservations(request, filterDate);
  };

  const handleDeleteClick = (id: number) => {
    setReservationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (reservationToDelete) {
      await deleteReservation(request, reservationToDelete);
      setDeleteDialogOpen(false);
      setReservationToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Gestión de Reservaciones
        </h2>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">
            {reservations.length} reservaciones
          </span>
        </div>
      </div>

      {/* Filtro por fecha */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <Label htmlFor="date-filter" className="text-sm font-medium mb-2 block">
          Filtrar por fecha (yyyy-mm-dd)
        </Label>
        <div className="flex gap-2">
          <Input
            id="date-filter"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleDateFilter} disabled={isLoading} size="sm">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>
      </div>

      {/* Lista de reservaciones */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Cargando reservaciones...</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              No hay reservaciones para la fecha seleccionada
            </p>
          </div>
        ) : (
          reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {reservation.customerFullName}
                    </h3>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {reservation.stage} - {reservation.seat}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <strong>Teléfono:</strong>{" "}
                      {reservation.customerPhoneNumber}
                    </div>
                    <div>
                      <strong>Fecha reserva:</strong>{" "}
                      {formatDate(reservation.reservationDate)}
                    </div>
                    <div>
                      <strong>Creada:</strong>{" "}
                      {formatDate(reservation.createdAt)}
                    </div>
                    {reservation.creator && (
                      <div>
                        <strong>Creador:</strong> {reservation.creator.name}{" "}
                        {reservation.creator.lastName}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick(reservation.id)}
                  className="ml-4"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas eliminar esta reservación? Esta acción no
              se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
