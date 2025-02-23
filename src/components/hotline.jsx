"use client";

import { useState, useEffect } from "react";
import { useGetLocationData, useHotlineGUI } from "@/zustand/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

// This component was created with Gen AI
const CopyCard = ({ text, label }) => {
  const [copied, setCopied] = useState(false);
  const locationData = useGetLocationData((state) => state.coordinates);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy number: ", err);
    }
  };

  return (
    <Card
      className="p-4 mb-2 cursor-pointer hover:bg-gray-50 transition-colors relative flex items-center justify-between group"
      onClick={handleCopy}
    >
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span className="text-lg">{text}</span>
      </div>
      <span className="text-gray-400 group-hover:text-gray-600">
        {copied ? (
          <Check className="h-5 w-5 text-green-500" />
        ) : (
          <Copy className="h-5 w-5" />
        )}
      </span>
    </Card>
  );
};

export default function Hotline() {
  const [emergencyNumbers, setEmergencyNumbers] = useState(null);
  const {
    locationCoordinates,
    locationCountryCode,
    locationEmergencyNumbers,
    error,
    loading,
    execute,
  } = useGetLocationData();

  const isVisible = useHotlineGUI((state) => state.isVisible);
  const setVisible = useHotlineGUI((state) => state.setVisible);

  useEffect(() => {
    execute();
  }, [execute]);

  useEffect(() => {
    setEmergencyNumbers(locationEmergencyNumbers);
  }, [locationEmergencyNumbers]);

  const triggerSOS = async () => {
    setVisible(false);
    const response = await fetch("/api/hotlines/sos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lat: locationCoordinates.latitude,
        lon: locationCoordinates.longitude,
      }),
    });
    window.location.reload();
  
  };

  if (loading) return null;
  if (error) return null;

  const renderEmergencyNumbers = () => {
    if (!emergencyNumbers?.data) return null;

    const { data } = emergencyNumbers;

    // Helper function to filter out empty strings and null values
    const filterValidNumbers = (numbers) => {
      if (!numbers?.all) return [];
      return numbers.all.filter((num) => num && num.trim() !== "");
    };

    const services = [
      { key: "ambulance", label: "Ambulance" },
      { key: "fire", label: "Fire" },
      { key: "police", label: "Police" },
      { key: "dispatch", label: "Dispatch" },
    ];

    return (
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-offBlack text-2xl font-bold">
            {data.country.name} Emergency Numbers
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-4">
          {services.map((service) => {
            const numbers = filterValidNumbers(data[service.key]);
            if (numbers.length === 0) return null;

            return numbers.map((number, index) => (
              <CopyCard
                key={`${service.key}-${index}`}
                text={number}
                label={service.label}
              />
            ));
          })}

          {services.every(
            (service) => filterValidNumbers(data[service.key]).length === 0
          ) && (
            <p className="text-center text-gray-500">
              No emergency numbers available for this location.
            </p>
          )}
        </div>
        <div className="text-center">
          <Button
            onClick={triggerSOS}
            className="rounded-full text-3xl bg-red-500 h-[75px] w-[75px] border-none hover:bg-red-700"
          >
            SOS
          </Button>
        </div>
      </DialogContent>
    );
  };

  return <>{renderEmergencyNumbers()}</>;
}
