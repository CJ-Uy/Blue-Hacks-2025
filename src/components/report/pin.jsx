import Image from "next/image";
import { AdvancedMarker } from "@vis.gl/react-google-maps";

// This function was partially made with Gen AI
export async function Pin({ reportDetails }) {
  return (
    <AdvancedMarker position={{ lat: 40.7128, lng: -74.006 }}>
      <div className="custom-marker">
        <Image
          priority
          key={reportDetails.imageUrl[0]}
          src={reportDetails.imageUrl[0]}
          alt="Loading..."
          width={200}
          height={200}
        />
      </div>
    </AdvancedMarker>
  );
}
