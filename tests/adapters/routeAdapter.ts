// tests/adapters/routeAdapter.ts
import { POST } from "@/app/api/reports/route";
import { NextResponse } from "next/server";

export function routeAdapter() {
  return async (req: Request, res: any) => {
    try {
      const result: NextResponse = await POST(req);
      const body = await result.json();
      res.status = result.status ?? 200;
      res.json = body;
    } catch (err: any) {
      res.status = 500;
      res.json = { error: err.message };
    }
  };
}
