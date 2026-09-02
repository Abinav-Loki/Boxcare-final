import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      status: "not_implemented",
      owner: "Developer C",
      message: "Handle cancelled CCAvenue payment attempt.",
    },
    { status: 501 },
  );
}
