/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type React from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useClubStore } from '@/store/clubStore';
import type { ReservationFormData } from '@/types';
import { toast } from 'sonner';

export const ReservationModal: React.FC = () => {
  const { selectedSeat, isModalOpen, isLoading, reserveSeat, closeModal } = useClubStore();
  const [formData, setFormData] = useState<ReservationFormData>({
    fullName: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState<Partial<ReservationFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ReservationFormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'El número de teléfono es requerido';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Formato de teléfono inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await reserveSeat(formData);
      toast.success('¡Reserva realizada exitosamente!', {
        description: `Asiento ${selectedSeat?.seatNumber} en ${selectedSeat?.section} reservado para ${formData.fullName}`
      });

      // Limpiar formulario
      setFormData({ fullName: '', phoneNumber: '' });
      setErrors({});
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      toast.error('Error al realizar la reserva', {
        description: 'Por favor intenta nuevamente'
      });
    }
  };

  const handleClose = () => {
    closeModal();
    setFormData({ fullName: '', phoneNumber: '' });
    setErrors({});
  };

  const getSectionDisplayName = (section: string) => {
    const sectionNames: Record<string, string> = {
      'vip-left': 'VIP Izquierda',
      'vip-top': 'VIP Superior',
      'vip-right': 'VIP Derecha',
      'general': 'Zona General',
      'bar': 'Barra',
      'dj': 'Área DJ',
      'entrance': 'Entrada'
    };
    return sectionNames[section] || section;
  };

  if (!selectedSeat) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reservar Asiento</DialogTitle>
          <DialogDescription>
            Asiento #{selectedSeat.seatNumber} en {getSectionDisplayName(selectedSeat.section)}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre Completo</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Ej: Juan Pérez"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              className={errors.fullName ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Número de Teléfono</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Ej: +1 809 772 1170"
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              className={errors.phoneNumber ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Reservando...' : 'Reservar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
