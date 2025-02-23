'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useModeratorStore } from "@/zustand/store";

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

export default function Feed() {
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const scrollContainerRefs = useRef({});
  
  const isLoggedIn = useModeratorStore((state) => state.isLoggedIn);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        let response;

        if (isLoggedIn) {
          response = await fetch("/api/report/all");
        } else {
          response = await fetch("/api/report/public");
        }

        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }

        const data = await response.json();
        setAllReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [isLoggedIn, reloadTrigger]);

  async function hideReport(id) {
    const response = await fetch("/api/report/hide", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    setReloadTrigger(prev => prev + 1);
  }

  async function unhideReport(id) {
    const response = await fetch("/api/report/unhide", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    setReloadTrigger(prev => prev + 1);
  }

  const scroll = (direction, reportId) => {
    if (scrollContainerRefs.current[reportId]) {
      const scrollAmount = scrollContainerRefs.current[reportId].offsetWidth * 0.75;
      scrollContainerRefs.current[reportId].scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto p-6 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <HideScrollbarStyles />
      <div className="space-y-12">
        {allReports.map((report) => (
          <div key={report.id} className="space-y-6 border-b pb-12 last:border-b-0">
            <div className="img relative">
              {isLoggedIn && (
                <div className="absolute right-2 top-2 z-10">
                  {report.hidden ? (
                    <button
                      onClick={() => unhideReport(report.id)}
                      className="bg-green-100 text-green-800 p-2 rounded-full hover:bg-green-200"
                    >
                      Unhide Report
                    </button>
                  ) : (
                    <button
                      onClick={() => hideReport(report.id)}
                      className="bg-red-100 text-red-800 p-2 rounded-full hover:bg-red-200"
                    >
                      Hide Report
                    </button>
                  )}
                </div>
              )}
              
              {report.imageUrl?.length > 0 ? (
                <div className="relative group">
                  <div 
                    ref={el => scrollContainerRefs.current[report.id] = el}
                    className="w-full h-96 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar"
                  >
                    <div className="flex h-full pl-4 pr-16 gap-4">
                      {report.imageUrl.map((url, index) => (
                        <div 
                          key={index} 
                          className="flex-none w-3/4 h-full snap-start"
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
                    onClick={() => scroll('left', report.id)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => scroll('right', report.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">No images available</div>
              )}
            </div>

            {report.tags && report.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {report.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div>
              <h1 className="text-2xl font-semibold mb-2">
                {report.location || 'Location not available'}
              </h1>
              <p className="text-gray-600">
                {report.description || 'No description available'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}