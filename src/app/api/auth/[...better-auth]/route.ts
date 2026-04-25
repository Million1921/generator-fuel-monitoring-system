import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

const handler = toNextJsHandler(auth);

export const GET = async (req: NextRequest) => {
    try {
        return await handler.GET(req);
    } catch (e: any) {
        console.error("BETTER AUTH GET ERROR:", e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}

export const POST = async (req: NextRequest) => {
    try {
        return await handler.POST(req);
    } catch (e: any) {
        console.error("BETTER AUTH POST ERROR:", e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
