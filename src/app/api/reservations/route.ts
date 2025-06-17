import { type NextRequest, NextResponse } from 'next/server';
import type { Reservation } from '@/types';

// Simulamos una base de datos en memoria (en producción usarías una BD real)
const reservations: Reservation[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos requeridos
    if (!body.seat || !body.stage || !body.customerFullName || !body.customerPhoneNumber) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el asiento ya está reservado
    const existingReservation = reservations.find(
      r => r.seat === body.seat && r.stage === body.stage
    );

    if (existingReservation) {
      return NextResponse.json(
        { error: 'Este asiento ya está reservado' },
        { status: 409 }
      );
    }

    // Crear nueva reserva
    const newReservation: Reservation = {
      seat: body.seat,
      stage: body.stage,
      customerFullName: body.customerFullName,
      customerPhoneNumber: body.customerPhoneNumber,
      date: new Date(body.date || Date.now())
    };

    reservations.push(newReservation);

    console.log('Nueva reserva creada:', newReservation);

    return NextResponse.json(
      {
        message: 'Reserva creada exitosamente',
        reservation: newReservation
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error al procesar reserva:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      reservations,
      total: reservations.length
    });
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
