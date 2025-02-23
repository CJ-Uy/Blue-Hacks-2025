'use client';

interface ConfirmButtonProps {
  onClick: () => void;
}

export default function ConfirmButton({ onClick }: ConfirmButtonProps) {
  return (
    <div 
      onClick={onClick}
      className="relative w-32 sm:w-36 md:w-40 lg:w-44 h-14 rounded-3xl bg-gradient-to-t from-[#FFAB5B] to-[#FFF123] flex items-center justify-center shadow-[33px_22px_40px_-17px_rgba(0,_0,_0,_0.7)] cursor-pointer hover:scale-105 transition-transform"
    >
      <span className="text-sm sm:text-base md:text-lg font-medium">
        Confirm
      </span>
    </div>
  );
}