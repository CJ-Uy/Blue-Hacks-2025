import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";

export async function POST(request) {
    const data = await request.json();

    return NextResponse.json(await prisma.report.findFirst({
        where: {
            id: data.id
        },
    }));
}
