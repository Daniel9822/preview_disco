"use client";

import { useState } from "react";
import { useApiClient } from "@/lib/hooks/authClient";
import { useAdminStore } from "@/store/adminStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Ban, Users, UserCheck, UserX } from "lucide-react";
// import { toast } from "sonner";

export function AdminUsers() {
  const { request } = useApiClient();
  const { users, isLoading, deleteUser, banUser } = useAdminStore();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [userToBan, setUserToBan] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleBanClick = (id: number) => {
    setUserToBan(id);
    setBanDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      await deleteUser(request, userToDelete);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const confirmBan = async () => {
    if (userToBan) {
      await banUser(request, userToBan);
      setBanDialogOpen(false);
      setUserToBan(null);
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

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1:
        return <UserCheck className="h-4 w-4 text-green-600" />;
      case 0:
        return <UserX className="h-4 w-4 text-red-600" />;
      default:
        return <UserX className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return { text: "Activo", className: "bg-green-100 text-green-800" };
      case 0:
        return { text: "Baneado", className: "bg-red-100 text-red-800" };
      default:
        return { text: "Inactivo", className: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Gestión de Usuarios
        </h2>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">{users.length} usuarios</span>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-900">
              {users.filter((u) => u.status === 1).length} Activos
            </span>
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <UserX className="h-5 w-5 text-red-600" />
            <span className="font-semibold text-red-900">
              {users.filter((u) => u.status === 0).length} Baneados
            </span>
          </div>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Cargando usuarios...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay usuarios registrados</p>
          </div>
        ) : (
          users.map((user) => {
            const statusInfo = getStatusText(user.status);
            return (
              <div
                key={user.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {user.name} {user.lastName}
                      </h3>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(user.status)}
                        <span
                          className={`text-xs px-2 py-1 rounded ${statusInfo.className}`}
                        >
                          {statusInfo.text}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <strong>Email:</strong> {user.email}
                      </div>
                      <div>
                        <strong>Teléfono:</strong> {user.phoneNumber}
                      </div>
                      <div>
                        <strong>Rol ID:</strong> {user.rolId || "Sin rol"}
                      </div>
                      <div>
                        <strong>Registrado:</strong>{" "}
                        {formatDate(user.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {user.status === 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBanClick(user.id)}
                        className="text-orange-600 border-orange-600 hover:bg-orange-50"
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación de usuario</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas eliminar este usuario? Esta acción
              eliminará permanentemente el usuario y todos sus datos asociados.
              Esta acción no se puede deshacer.
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
              Eliminar Usuario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación de baneo */}
      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar baneo de usuario</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas banear este usuario? El usuario no podrá
              acceder al sistema una vez baneado. Puedes revertir esta acción
              más adelante.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmBan}>
              Banear Usuario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
