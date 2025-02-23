import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";

export async function GET() {
    return NextResponse.json(await prisma.report.findMany({
        where: {
            hidden: false,
        },
    }));
}