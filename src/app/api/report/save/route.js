import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";
import { put } from "@vercel/blob";

// This function was partially created using Generative AI
export async function POST(request) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const { lat, lon, timeOfReport, description } = data;

    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${Number.parseFloat(lat)},${Number.parseFloat(lon)}&key=${process.env.NEXT_PUBLIC_GOOGLE_API}`)
    const cityData = await response.json();

    console.log(cityData);
    // Create a report to attach the images to
    const report = await prisma.report.create({
        data: {
            lat: Number.parseFloat(lat),
            lon: Number.parseFloat(lon),
            description,
            timeOfReport,
            location: cityData.results[1].formatted_address
        },
    });

    // Save all images to the bucket and update the report to reference them\]
    const files = formData.getAll("files");
    for (const file of files){
        // Store the blob into a bucket
        const originalExtension = file.name.split(".").pop();
        const blob = await put(`${report.id}.${originalExtension}`, file, {
            access: "public",
            contentType: file.type,
        });

        // Update the report to the newly uploaded image
        const updatedReport = await prisma.report.update({
            where: {
                id: report.id
            }, data: {
                imageUrl: {
                    push: blob.url
                },
            },
        });
    }

  return NextResponse.json({"State": "Success"});
}
