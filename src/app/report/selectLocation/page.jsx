"use client";

import { useState } from "react";
import ModLogin from "@/components/modLogin";
import SelectLocation from "@/components/selectLocation";
import ConfirmButton from "@/components/confirmButton";
import { useFormStore } from "@/zustand/store";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const formData = useFormStore((state) => state.formData);

  const handleLocationChange = (center) => {
    setSelectedLocation(center);
  };

  // This function was partially made with Gen AI
  async function handleConfirmClick() {
    try {
      if (!selectedLocation) {
        alert("Please select a location first");
        return;
      }

      if (!formData) {
        alert("No form data found. Please fill out the previous form first.");
        return;
      }

      // Clone the FormData since it's not directly mutable
      const finalFormData = new FormData();

      // Copy all existing entries from the stored formData
      for (const [key, value] of formData.entries()) {
        finalFormData.append(key, value);
      }

      // Add the location data
      finalFormData.append("lat", selectedLocation.lat);
      finalFormData.append("lon", selectedLocation.lng);

      const response = await fetch("/api/report/save", {
        method: "POST",
        body: finalFormData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      // Clear the form data from the store after successful submission
      useFormStore.getState().setFormData(null);

      // Redirect to home
      router.push("/");
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    }
  };

  return (
    <>
      <div className="relative w-full h-[100vh] bg-offBlack">
        <div className="absolute z-30 left-1/2 -translate-x-1/2 bottom-[1vh] translate-y-7/8">
          <ConfirmButton onClick={handleConfirmClick} />
        </div>
        <SelectLocation onCenterChange={handleLocationChange} />
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            className="text-offBlack absolute right-[calc(50vw-25px)] top-[calc(45vh-25px)] min-h-[50px] min-w-[50px]"
          >
            <title>Pin of the selected individual</title>
            <path
              fill="currentColor"
              d="M12 12q.825 0 1.413-.587T14 10t-.587-1.412T12 8t-1.412.588T10 10t.588 1.413T12 12m0 10q-4.025-3.425-6.012-6.362T4 10.2q0-3.75 2.413-5.975T12 2t5.588 2.225T20 10.2q0 2.5-1.987 5.438T12 22"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
