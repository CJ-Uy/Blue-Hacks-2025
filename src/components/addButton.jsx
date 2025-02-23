"use client";

import { useRouter } from "next/navigation";

export default function AddButton() {
  const router = useRouter();
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      onClick={() => router.push("/report")}
      className="relative w-14 h-14 rounded-full bg-gradient-to-t from-[#FFAB5B] to-[#FFF123] flex items-center justify-center shadow-[33px_22px_40px_-17px_rgba(0,_0,_0,_0.7)]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        className="text-black"
      >
        <title>Upload a Report</title>
        <path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
      </svg>
    </div>
  );
}
