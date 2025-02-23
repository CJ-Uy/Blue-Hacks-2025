import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();
  const countryCode = data.countryCode;

  const response = await fetch(
    `https://emergencynumberapi.com/api/country/${countryCode}`
  );

  return NextResponse.json(await response.json());
}
