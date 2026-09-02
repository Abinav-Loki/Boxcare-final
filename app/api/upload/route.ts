import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      status: "not_implemented",
      owner: "Developer B",
      message: "Upload route placeholder for product/category/banner images.",
    },
    { status: 501 },
  );
}
