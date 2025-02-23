"use client";

import { useState, useEffect, useRef } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HideScrollbarStyles = () => (
  <style jsx global>{`
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
);

export default function Details() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef(null);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/report/details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: "085320b3-8c3d-4e3a-8d47-e5f11d2747c9" }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch report");
      }

      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <div className="img relative">
              {loading ? (
                <div className="p-4 text-center">Loading...</div>
              ) : report?.imageUrl?.length > 0 ? (
                <div className="relative group">
                  <div
                    ref={scrollContainerRef}
                    className="w-full h-64 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar"
                  >
                    <div className="flex h-full pl-4 pr-16 gap-4">
                      {report.imageUrl.map((url, index) => (
                        <div
                          key={index}
                          className="flex-none w-7/8 h-full snap-start"
                        >
                          <img
                            src={url}
                            alt={`Report image ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => scroll("left")}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => scroll("right")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No images available
                </div>
              )}
            </div>
            <DrawerTitle className=" flex text-left justify-center items-center">
              <div className="w-[85vw]">
                Loyola Heights, Quezon City, Metro Manila, Philippines
              </div>
            </DrawerTitle>
            <DrawerDescription className="flex text-left justify-center items-center">
              <div className="w-[85vw]">
                Hello, I want to report severe flooding in [specific area, e.g.,
                Barangay XYZ]. Heavy rainfall has caused water levels to rise
                rapidly, making roads impassable and affecting homes. Residents
                may need assistance, especially those in low-lying areas. Please
                send emergency response teams if possible.
              </div>
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>

      <HideScrollbarStyles />
    </div>
  );
}
