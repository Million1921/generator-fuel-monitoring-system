import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [
        "http://localhost:3000",
        "https://gen-fuel-mon.vercel.app",
    ],
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "TECHNICIAN",
                input: false, // Don't allow users to set their own role on signup
            }
        }
    }
});
