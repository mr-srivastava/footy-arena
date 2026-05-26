import { NextResponse } from "next/server";
import { openApiSpec } from "@/lib/openapi/spec";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ detail: "Not found" }, { status: 404 });
  }

  return NextResponse.json(openApiSpec);
}
