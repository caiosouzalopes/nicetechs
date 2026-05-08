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
    const users = await sql`
      select id, email, password_hash, role
      from users
      where email = ${email}
      and deleted_at is null
      limit 1
    `;

    const user = (users as any[])[0];
    if (!user) {
      return NextResponse.json(
        { error: "Email ou senha inválidos" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Email ou senha inválidos" },
        { status: 401 }
      );
    }

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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Erro ao fazer login" },
      { status: 500 }
    );
  }
}
