import { prisma } from "@/app/utils/prisma";
import { NextResponse } from "next/server";

// This function was partially made with Gen AI
export async function POST(request) {
  const data = await request.json();

  const { lat, lon, timeOfReport, description } = data;

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${Number.parseFloat(
      lat
    )},${Number.parseFloat(lon)}&key=${process.env.NEXT_PUBLIC_GOOGLE_API}`
  );
  const cityData = await response.json();

  const sos = await prisma.report.create({
    data: {
      lat: Number.parseFloat(data.lat),
      lon: Number.parseFloat(data.lon),
      description: "EMERGENCY SOS",
      location: cityData.results[1].formatted_address,
    },
  });

  return NextResponse.json(
    await prisma.report.update({
      where: {
        id: sos.id,
      },
      data: {
        imageUrl: {
          push: "https://3ufbik4jemsztogi.public.blob.vercel-storage.com/SOS-HP9PzARKPmGRAfYB3tL7YfPMM2PXir.gif",
        },
      },
    })
  );
}
