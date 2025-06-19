"use client";

import type React from "react";
import { SeatComponent } from "./SeatComponent";
import { ReservationModal } from "./ReservationModal";
import LoginButton from "./LoginButton";
import { useClubStore } from "@/store/clubStore";
import { useEffect } from "react";
import { useApiClient } from "@/lib/hooks/authClient";
import { useAuth } from "@/lib/hooks/auth";
import DataPicker from "./DataPicker";
import { Button } from "./ui/button";
import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";
// import Image from "next/image";

export const ClubLayout: React.FC = () => {
  const { request } = useApiClient();
  const { session } = useAuth();
  const router = useRouter();
  const { getReservations } = useClubStore();

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;
    getReservations(request, todayStr);
  }, []);

  return (
    <div className="w-full h-screen bg-black relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/bg.jpg"
          alt="Background"
          className="max-h-full max-w-full object-contain"
          style={{
            WebkitMaskImage: `
        radial-gradient(circle at center,
          rgba(0,0,0,1) 60%,
          rgba(0,0,0,0) 100%)
      `,
            maskImage: `
        radial-gradient(circle at center,
          rgba(0,0,0,1) 60%,
          rgba(0,0,0,0) 100%)
      `,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
          }}
        />
      </div>

      <div className="absolute top-8 left-8 z-50">
        <div className="flex items-center gap-3">
          <LoginButton />
          <DataPicker />
          {session && (
            <Button
              onClick={() => router.push("/admin")}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <Shield className="w-4 h-4" />
              Admin
            </Button>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20 bg-black/80 p-2 rounded-lg">
        <h1 className="text-2xl md:text-4xl font-bold text-white text-center mb-1">
          🎭 Club Discoteca
        </h1>
        <p className="text-gray-300 text-center text-sm md:text-base">
          Selecciona tu asiento preferido para reservar
        </p>
      </div>

      {/* Leyenda */}
      <div className="absolute top-4 right-4 bg-black/80 p-3 rounded-lg z-20">
        <h3 className="text-white font-bold mb-2 text-sm">Leyenda</h3>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-white">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded" />
            <span className="text-white">Seleccionado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded" />
            <span className="text-white">Reservado</span>
          </div>
          {/* <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 border-2 border-yellow-400 rounded" />
            <span className="text-white">VIP</span>
          </div> */}
        </div>
      </div>

      {/* Contenedor principal con scroll horizontal */}
      <div className="absolute inset-0 pt-20 pb-4 overflow-auto">
        <div className="min-w-[1300px] h-full px-4">
          <div
            className="relative w-full h-full mx-auto  rounded-lg"
            style={{ width: "1280px", height: "720px" }}
          >
            {/* VIP TOP BORDER - Recuadro negro superior */}
            <div
              className="absolute border-3 border-black bg-transparent rounded-lg"
              style={{
                top: "10px",
                left: "150px",
                width: "600px",
                height: "60px",
              }}
            />

            {/* VIP TOP LABEL */}
            {/* <div
              className="absolute text-black font-bold text-2xl z-10 text-center"
              style={{
                top: '70px',
                left: '150px',
                width: '600px'
              }}
            >
              VIP
            </div> */}

            {/* VIP LEFT BORDER - Recuadro negro izquierdo */}
            <div
              className="absolute border-3 border-black bg-transparent rounded-lg"
              style={{
                top: "70px",
                left: "5px",
                width: "120px",
                height: "280px",
              }}
            />

            {/* VIP LEFT LABEL */}
            {/* <div
              className="absolute text-black font-bold text-xl z-10 flex items-center justify-center"
              style={{
                top: '70px',
                left: '5px',
                width: '120px',
                height: '280px',
                writingMode: 'vertical-rl',
                textOrientation: 'mixed'
              }}
            >
              VIP
            </div> */}

            {/* VIP RIGHT BORDER - Recuadro negro derecho */}
            <div
              className="absolute border-3 border-black bg-transparent rounded-lg"
              style={{
                top: "350px",
                right: "10px",
                width: "120px",
                height: "420px",
              }}
            />

            {/* VIP RIGHT LABEL */}
            {/* <div
              className="absolute text-black font-bold text-xl z-10 flex items-center justify-center"
              style={{
                top: '350px',
                right: '10px',
                width: '120px',
                height: '420px',
                writingMode: 'vertical-rl',
                textOrientation: 'mixed'
              }}
            >
              VIP
            </div> */}

            {/* DJ AREA - Esquina superior derecha */}
            <div
              className="absolute bg-blue-600 border-3 border-blue-700 rounded-lg flex items-center justify-center z-10"
              style={{
                top: "30px",
                right: "18px",
                width: "150px",
                height: "150px",
              }}
            >
              <span className="text-white font-bold">DJ</span>
            </div>

            {/* BARRA (BAR) - Parte inferior centro */}
            <div
              className="absolute bg-black border-3 border-blue-700  flex items-center justify-center z-10"
              style={{
                bottom: "0px",
                left: "200px",
                width: "600px",
                height: "40px",
                borderRadius: "10px 10px 0px 0px",
              }}
            >
              <span className="text-white font-bold">BARRA (BAR)</span>
            </div>

            {/* ENTRADA/SALIDA - Esquina inferior derecha */}
            <div
              className="absolute bg-black border-3 border-blue-700 rounded-lg flex items-center justify-center z-10"
              style={{
                bottom: "0",
                right: "20px",
                width: "150px",
                height: "40px",
                borderRadius: "10px 10px 0px 0px",
              }}
            >
              <span className="text-white font-bold text-sm">
                ENTRADA / SALIDA
              </span>
            </div>

            {/* Dance Floor Central - Area gris semi-transparente */}
            <div
              className="absolute bg-gray-400 border-2 border-gray-500 rounded-lg opacity-20"
              style={{
                top: "150px",
                left: "200px",
                width: "750px",
                height: "450px",
              }}
            />

            {/* ===== ASIENTOS VIP TOP ===== */}
            <SeatComponent
              seatInfo={{
                id: "vip-top-1",
                seatNumber: "1",
                section: "vip-top",
              }}
              className="absolute"
              style={{
                top: "20px",
                left: "160px",
                width: "100px",
                height: "40px",
              }}
            />
            <SeatComponent
              seatInfo={{
                id: "vip-top-2",
                seatNumber: "2",
                section: "vip-top",
              }}
              className="absolute"
              style={{
                top: "20px",
                left: "280px",
                width: "100px",
                height: "40px",
              }}
            />
            <SeatComponent
              seatInfo={{
                id: "vip-top-3",
                seatNumber: "3",
                section: "vip-top",
              }}
              className="absolute"
              style={{
                top: "20px",
                left: "400px",
                width: "100px",
                height: "40px",
              }}
            />
            <SeatComponent
              seatInfo={{
                id: "vip-top-4",
                seatNumber: "4",
                section: "vip-top",
              }}
              className="absolute"
              style={{
                top: "20px",
                left: "520px",
                width: "100px",
                height: "40px",
              }}
            />
            <SeatComponent
              seatInfo={{
                id: "vip-top-5",
                seatNumber: "5",
                section: "vip-top",
              }}
              className="absolute"
              style={{
                top: "20px",
                left: "640px",
                width: "100px",
                height: "40px",
              }}
            />

            {/* ===== ASIENTOS VIP LEFT ===== */}
            <SeatComponent
              seatInfo={{
                id: "vip-left-1",
                seatNumber: "1",
                section: "vip-left",
              }}
              className="absolute"
              style={{
                top: "100px",
                left: "20px",
                width: "80px",
                height: "60px",
              }}
            />
            <SeatComponent
              seatInfo={{
                id: "vip-left-2",
                seatNumber: "2",
                section: "vip-left",
              }}
              className="absolute"
              style={{
                top: "180px",
                left: "20px",
                width: "80px",
                height: "60px",
              }}
            />
            <SeatComponent
              seatInfo={{
                id: "vip-left-3",
                seatNumber: "3",
                section: "vip-left",
              }}
              className="absolute"
              style={{
                top: "260px",
                left: "20px",
                width: "80px",
                height: "60px",
              }}
            />

            {/* ===== ASIENTOS VIP RIGHT ===== */}
            <SeatComponent
              seatInfo={{
                id: "vip-right-1",
                seatNumber: "1",
                section: "vip-right",
              }}
              className="absolute"
              style={{
                top: "200px",
                right: "20px",
                width: "80px",
                height: "60px",
              }}
            />
            <SeatComponent
              seatInfo={{
                id: "vip-right-2",
                seatNumber: "2",
                section: "vip-right",
              }}
              className="absolute"
              style={{
                top: "265px",
                right: "20px",
                width: "80px",
                height: "60px",
              }}
            />
            <SeatComponent
              seatInfo={{
                id: "vip-right-3",
                seatNumber: "3",
                section: "vip-right",
              }}
              className="absolute"
              style={{
                top: "330px",
                right: "20px",
                width: "80px",
                height: "60px",
              }}
            />
            <SeatComponent
              seatInfo={{
                id: "vip-right-4",
                seatNumber: "4",
                section: "vip-right",
              }}
              className="absolute"
              style={{
                top: "400px",
                right: "20px",
                width: "80px",
                height: "60px",
              }}
            />
            {/* <SeatComponent
              seatInfo={{ id: "vip-right-5", seatNumber: "5", section: "vip-right" }}
              className="absolute"
              style={{ top: '470px', right: '20px', width: '80px', height: '60px' }}
            />
            <SeatComponent
              seatInfo={{ id: "vip-right-6", seatNumber: "6", section: "vip-right" }}
              className="absolute"
              style={{ top: '540px', right: '20px', width: '80px', height: '60px' }}
            />
            <SeatComponent
              seatInfo={{ id: "vip-right-7", seatNumber: "7", section: "vip-right" }}
              className="absolute"
              style={{ top: '610px', right: '20px', width: '80px', height: '60px' }}
            /> */}

            {/* ===== ASIENTOS GENERALES ===== */}

            {/* Asiento individual izquierdo grande */}
            <SeatComponent
              seatInfo={{
                id: "general-single-left",
                seatNumber: "1",
                section: "general",
              }}
              className="absolute"
              style={{
                top: "380px",
                left: "19px",
                width: "78px",
                height: "230px",
              }}
            />

            {/* Mesa superior izquierda */}
            <SeatComponent
              seatInfo={{
                id: "general-table-upper-left",
                seatNumber: "2",
                section: "general",
              }}
              className="absolute"
              style={{
                top: "337px",
                left: "420px",
                width: "90px",
                height: "71px",
              }}
            />

            {/* Grupo de 3 asientos pequeños en fila superior centro */}
            <SeatComponent
              seatInfo={{
                id: "general-top-small-1",
                seatNumber: "3",
                section: "general",
              }}
              className="absolute"
              style={{
                top: "270px",
                left: "540px",
                width: "50px",
                height: "50px",
              }}
            />
            <SeatComponent
              seatInfo={{
                id: "general-top-small-2",
                seatNumber: "4",
                section: "general",
              }}
              className="absolute"
              style={{
                top: "270px",
                left: "600px",
                width: "50px",
                height: "50px",
              }}
            />
            <SeatComponent
              seatInfo={{
                id: "general-top-small-3",
                seatNumber: "5",
                section: "general",
              }}
              className="absolute"
              style={{
                top: "270px",
                left: "660px",
                width: "50px",
                height: "50px",
              }}
            />

            {/* 2 asientos en fila superior derecha */}
            <SeatComponent
              seatInfo={{
                id: "general-top-right-1",
                seatNumber: "6",
                section: "general",
              }}
              className="absolute"
              style={{
                top: "247px",
                left: "746px",
                width: "72px",
                height: "158px",
              }}
            />
            <SeatComponent
              seatInfo={{
                id: "general-top-right-2",
                seatNumber: "7",
                section: "general",
              }}
              className="absolute"
              style={{
                top: "265px",
                left: "832px",
                width: "50px",
                height: "50px",
              }}
            />

            {/* Asiento individual derecho pequeño */}
            <SeatComponent
              seatInfo={{
                id: "general-single-right",
                seatNumber: "8",
                section: "general",
              }}
              className="absolute"
              style={{
                top: "324px",
                left: "835px",
                width: "50px",
                height: "50px",
              }}
            />

            {/* Mesa central grande */}
            <SeatComponent
              seatInfo={{
                id: "general-center-large",
                seatNumber: "9",
                section: "general",
              }}
              className="absolute"
              style={{
                top: "335px",
                left: "520px",
                width: "220px",
                height: "70px",
              }}
            />

            {/* Mesas inferiores - 6 mesas de 2 asientos cada una (2 filas x 3 columnas) */}

            {/* Fila 1 */}
            <SeatComponent
              seatInfo={{
                id: "general-bottom-10",
                seatNumber: "10",
                section: "general",
              }}
              className="absolute"
              style={{
                top: "415px",
                left: "380px",
                width: "60px",
                height: "60px",
              }}
            />
            <SeatComponent
              seatInfo={{
                id: "general-bottom-11",
                seatNumber: "11",
                section: "general",
              }}
              className="absolute"
              style={{
                top: "415px",
                left: "450px",
                width: "60px",
                height: "60px",
              }}
            />

            <SeatComponent
              seatInfo={{
                id: "general-bottom-12",
                seatNumber: "12",
                section: "general",
              }}
              className="absolute"
              style={{
                top: "415px",
                left: "520px",
                width: "60px",
                height: "60px",
              }}
            />
            <SeatComponent
              seatInfo={{
                id: "general-bottom-13",
                seatNumber: "13",
                section: "general",
              }}
              className="absolute"
              style={{
                top: "480px",
                left: "520px",
                width: "60px",
                height: "60px",
              }}
            />

            <SeatComponent
              seatInfo={{
                id: "general-bottom-14",
                seatNumber: "14",
                section: "general",
              }}
              className="absolute"
              style={{
                top: "415px",
                left: "588px",
                width: "60px",
                height: "60px",
              }}
            />
            <SeatComponent
              seatInfo={{
                id: "general-bottom-15",
                seatNumber: "15",
                section: "general",
              }}
              className="absolute"
              style={{
                top: "480px",
                left: "588px",
                width: "60px",
                height: "60px",
              }}
            />

            {/* Fila 2 */}
            <SeatComponent
              seatInfo={{
                id: "general-bottom-16",
                seatNumber: "16",
                section: "general",
              }}
              className="absolute"
              style={{
                top: "480px",
                left: "380px",
                width: "60px",
                height: "60px",
              }}
            />
            <SeatComponent
              seatInfo={{
                id: "general-bottom-17",
                seatNumber: "17",
                section: "general",
              }}
              className="absolute"
              style={{
                top: "480px",
                left: "450px",
                width: "60px",
                height: "60px",
              }}
            />

            <SeatComponent
              seatInfo={{
                id: "general-bottom-18",
                seatNumber: "18",
                section: "general",
              }}
              className="absolute"
              style={{
                top: "415px",
                left: "654px",
                width: "60px",
                height: "60px",
              }}
            />
            <SeatComponent
              seatInfo={{
                id: "general-bottom-19",
                seatNumber: "19",
                section: "general",
              }}
              className="absolute"
              style={{
                top: "480px",
                left: "654px",
                width: "60px",
                height: "60px",
              }}
            />

            <SeatComponent
              seatInfo={{
                id: "general-bottom-20",
                seatNumber: "20",
                section: "general",
              }}
              className="absolute"
              style={{
                top: "415px",
                left: "720px",
                width: "60px",
                height: "60px",
              }}
            />
            <SeatComponent
              seatInfo={{
                id: "general-bottom-21",
                seatNumber: "21",
                section: "general",
              }}
              className="absolute"
              style={{
                top: "480px",
                left: "720px",
                width: "60px",
                height: "60px",
              }}
            />
          </div>
        </div>
      </div>

      {/* Modal de reserva */}
      <ReservationModal />
    </div>
  );
};
