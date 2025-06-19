import type React from "react";
import { cn } from "@/lib/utils";
import type { SeatInfo } from "@/types";
import { useClubStore } from "@/store/clubStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SeatComponentProps {
  seatInfo: SeatInfo;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const SeatComponent: React.FC<SeatComponentProps> = ({
  seatInfo,
  className = "",
  style = {},
  children,
}) => {
  const { selectSeat, getSeatStatus, reservations } = useClubStore();
  const status = getSeatStatus(seatInfo.id);

  // Buscar la reserva correspondiente a este asiento
  const reservation = reservations.find(
    (r) =>
      // El id generado en getReservations es `${stage}-${seat}`
      `${r.stage}-${r.seat}` === seatInfo.id
  );

  const getSeatStyles = () => {
    switch (status) {
      case "available":
        return "bg-blue-500 hover:bg-blue-600 border-blue-600 cursor-pointer hover:scale-110";
      case "selected":
        return "bg-yellow-500 hover:bg-yellow-600 border-yellow-600 cursor-pointer scale-110";
      case "reserved":
        return "bg-red-500 border-red-600 cursor-not-allowed opacity-60";
      default:
        return "bg-gray-500 border-gray-600";
    }
  };

  const getSectionStyle = () => {
    const isVip = seatInfo.section.includes("vip");

    if (isVip) {
      return {
        borderColor: "#fbbf24", // gold
        borderWidth: "3px",
        boxShadow: "0 0 10px rgba(251, 191, 36, 0.3)",
      };
    }

    return {
      borderColor: "#3b82f6", // blue
      borderWidth: "2px",
    };
  };

  const handleClick = () => {
    if (status !== "reserved") {
      selectSeat(seatInfo);
    }
  };

  const isVip = seatInfo.section.includes("vip");

  const seatDiv = (
    <div
      className={cn(
        "border rounded-lg flex items-center justify-center text-white font-bold text-xs transition-all duration-300 transform select-none",
        getSeatStyles(),
        isVip && "shadow-lg",
        className
      )}
      style={{
        ...getSectionStyle(),
        ...style,
      }}
      onClick={handleClick}
      title={`Asiento ${seatInfo.seatNumber} - ${seatInfo.section} (${status})`}
    >
      <span className="relative z-10">{children || seatInfo.seatNumber}</span>
      {/* VIP indicator */}
      {isVip && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-yellow-600 flex items-center justify-center">
          <span className="text-[8px] font-bold text-black">★</span>
        </div>
      )}
    </div>
  );

  if (status === "reserved" && reservation) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{seatDiv}</TooltipTrigger>
          <TooltipContent side="top">
            <div className="text-xs">
              <div>
                <b>Reserva creada por:</b>
              </div>
              <div>
                {reservation?.creator?.name +
                  " " +
                  (reservation?.creator?.lastName || "")}
              </div>
              <div>
                <b>Tel:</b> {reservation?.customerPhoneNumber}
              </div>
              <div>
                <b>Usuario:</b> {reservation?.customerFullName}
              </div>
              <div>
                <b>Fecha:</b>{" "}
                {reservation?.reservationDate
                  ? new Date(reservation?.reservationDate).toLocaleString()
                  : ""}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return seatDiv;
};
