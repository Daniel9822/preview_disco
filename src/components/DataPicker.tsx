import { useApiClient } from "@/lib/hooks/authClient";
import { useClubStore } from "@/store/clubStore";
import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DataPicker() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { getReservations } = useClubStore();
  const { request } = useApiClient();

  console.log(selectedDate);

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // Formato YYYY-MM-DD
      console.log({formattedDate})
      console.log({selectedDate})

      getReservations(request, formattedDate);
    }
  }, [selectedDate]);

  return (
    <div>
      <ReactDatePicker
        selected={selectedDate}
        onChange={setSelectedDate}
        className="w-full h-10 px-3 rounded-md border"
        placeholderText="Seleccionar fecha"
        dateFormat="yyyy-MM-dd"
      />
    </div>
  );
}
