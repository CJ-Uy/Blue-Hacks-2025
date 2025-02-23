import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";

export async function POST(request) {
  const data = await request.json();
  const hiddenReport = await prisma.report.update({
    where: {
      id: data.id,
    },
    data: {
      hidden: false,
    },
  });

  return NextResponse.json(hiddenReport);
}
