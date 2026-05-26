import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import crypto from "crypto";
import { promisify } from "util";

export const dynamic = "force-dynamic";

const scryptAsync = promisify(crypto.scrypt);

async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function GET() {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: "admin@ethiotelecom.et" },
    });

    if (existingUser) {
      await prisma.session.deleteMany({ where: { userId: existingUser.id } });
      await prisma.account.deleteMany({ where: { userId: existingUser.id } });
      await prisma.user.delete({ where: { id: existingUser.id } });
    }

    const hashedPassword = await hashPassword("Admin@123");

    const newUser = await prisma.user.create({
      data: {
        email: "admin@ethiotelecom.et",
        name: "System Admin",
        role: "ADMIN",
        emailVerified: true,
      },
    });

    await prisma.account.create({
      data: {
        accountId: newUser.id,
        providerId: "credential",
        userId: newUser.id,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: "✅ ADMIN USER CREATED SUCCESSFULLY!",
      credentials: {
        email: "admin@ethiotelecom.et",
        password: "Admin@123",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
