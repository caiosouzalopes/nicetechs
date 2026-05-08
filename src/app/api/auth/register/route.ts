import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getNeonSql } from "@/lib/neon";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const EXPIRES_IN_SECONDS = 60 * 60;

function signAccessToken(payload: { sub: string; email: string; role: string }): string {
  const secret = process.env.JWT_SECRET || "nicetech-default-secret-key-change-in-production";
  return jwt.sign(payload, secret, { expiresIn: EXPIRES_IN_SECONDS });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const sql = getNeonSql();
    const existing = await sql`
      select id from users where email = ${email} and deleted_at is null limit 1
    `;

    if ((existing as any[]).length > 0) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const users = await sql`
      insert into users (email, password_hash, role)
      values (${email}, ${passwordHash}, 'user')
      returning id, email, role
    `;

    const user = (users as any[])[0];
    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    return NextResponse.json({
      access_token: accessToken,
      refresh_token: "",
      expires_in: EXPIRES_IN_SECONDS,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 }
    );
  }
}
